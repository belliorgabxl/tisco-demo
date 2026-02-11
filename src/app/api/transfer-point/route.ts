import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

import { connectDB } from "@/libs/database";
import { verifyToken } from "@/libs/auth";
import { Credit } from "@/models/Credit";
import { History, HistoryStatus, HistoryType } from "@/models/History";

type PointType = "TISCO" | "TWEALTH" | "TINSURE";

const TransferSchema = z
  .object({
    fromPointType: z.enum(["TISCO", "TWEALTH", "TINSURE"]),
    toPointType: z.enum(["TISCO", "TWEALTH", "TINSURE"]),
    amount: z.number().int().positive(),
    description: z.string().optional(),
    metadata: z.any().optional(),
    transactionRef: z.string().optional(),
  })
  .refine((v) => v.fromPointType !== v.toPointType, {
    message: "fromPointType and toPointType must be different",
    path: ["toPointType"],
  });

function getAuthToken(req: Request) {
  return (
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.headers.get("cookie")?.match(/auth_token=([^;]+)/)?.[1]
  );
}

function pointField(pointType: PointType) {
  if (pointType === "TISCO") return "tiscoPoint";
  if (pointType === "TWEALTH") return "twealthPoint";
  return "tinsurePoint";
}

function buildPointChange(pointType: PointType, delta: number) {
  return {
    tiscoPoint: pointType === "TISCO" ? delta : 0,
    twealthPoint: pointType === "TWEALTH" ? delta : 0,
    tinsurePoint: pointType === "TINSURE" ? delta : 0,
  };
}

function buildBalanceAfter(credit: any) {
  return {
    tiscoPoint: Number(credit?.tiscoPoint ?? 0),
    twealthPoint: Number(credit?.twealthPoint ?? 0),
    tinsurePoint: Number(credit?.tinsurePoint ?? 0),
  };
}

export async function POST(req: Request) {
  const authToken = getAuthToken(req);
  if (!authToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  let decoded: any;
  try {
    decoded = verifyToken(authToken);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = TransferSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid input",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  await connectDB();

  const userId = decoded.userId;
  const {
    fromPointType,
    toPointType,
    amount,
    description,
    metadata,
    transactionRef,
  } = parsed.data;

  const fromField = pointField(fromPointType);
  const toField = pointField(toPointType);

  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined;
  const userAgent = req.headers.get("user-agent") || undefined;

  try {
    // ensure credit exists
    await Credit.updateOne(
      { userId },
      {
        $setOnInsert: {
          userId,
          tiscoPoint: 0,
          twealthPoint: 0,
          tinsurePoint: 0,
          totalPoints: 0,
        },
      },
      { upsert: true },
    );

    // ✅ atomic transfer: ต้องมี from >= amount
    const updated = await Credit.findOneAndUpdate(
      { userId, [fromField]: { $gte: amount } },
      {
        $inc: {
          [fromField]: -amount,
          [toField]: amount,
          // totalPoints ไม่เปลี่ยน เพราะเป็นแค่ transfer ภายใน
        },
      },
      { new: true },
    );

    if (!updated) {
      const current = await Credit.findOne({ userId });
      // บันทึก history แบบ FAILED (ใช้ type เดิมเพื่อไม่ชน enum)
      await History.create({
        userId: new mongoose.Types.ObjectId(userId),
        type: HistoryType.POINT_SPEND,
        status: HistoryStatus.FAILED,
        pointChange: buildPointChange(fromPointType, -amount),
        balanceAfter: buildBalanceAfter(current),
        description: description ?? "Insufficient balance",
        metadata: {
          ...(metadata ?? {}),
          action: "transfer",
          fromPointType,
          toPointType,
          reason: "insufficient_balance",
        },
        transactionRef,
        ipAddress,
        userAgent,
      });

      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 },
      );
    }

    // ✅ history 2 รายการ (ใช้ enum เดิม ปลอดภัยสุด)
    const transferId = crypto.randomUUID();

    await History.create([
      {
        userId: new mongoose.Types.ObjectId(userId),
        type: HistoryType.POINT_SPEND,
        status: HistoryStatus.SUCCESS,
        pointChange: buildPointChange(fromPointType, -amount),
        balanceAfter: buildBalanceAfter(updated),
        description: description ?? "Point transferred (debit)",
        metadata: {
          ...(metadata ?? {}),
          action: "transfer",
          transferId,
          fromPointType,
          toPointType,
        },
        transactionRef,
        ipAddress,
        userAgent,
      },
      {
        userId: new mongoose.Types.ObjectId(userId),
        type: HistoryType.POINT_EARN,
        status: HistoryStatus.SUCCESS,
        pointChange: buildPointChange(toPointType, amount),
        balanceAfter: buildBalanceAfter(updated),
        description: description ?? "Point transferred (credit)",
        metadata: {
          ...(metadata ?? {}),
          action: "transfer",
          transferId,
          fromPointType,
          toPointType,
        },
        transactionRef,
        ipAddress,
        userAgent,
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Transfer success",
      data: {
        tiscoPoint: updated.tiscoPoint,
        twealthPoint: updated.twealthPoint,
        tinsurePoint: updated.tinsurePoint,
        totalPoints: updated.totalPoints,
      },
    });
  } catch (error: any) {
    console.error("Transfer point error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to transfer points",
        error: error?.message,
      },
      { status: 500 },
    );
  }
}

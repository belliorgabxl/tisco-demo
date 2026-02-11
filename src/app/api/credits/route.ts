import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/libs/database";
import { Credit } from "@/models/Credit";
import { verifyToken } from "@/libs/auth";
import mongoose from "mongoose";
import { History, HistoryStatus, HistoryType } from "@/models/History";

type PointType = "TISCO" | "TWEALTH" | "TINSURE";

const PointTxSchema = z.object({
  action: z.enum(["earn", "spend"]),
  pointType: z.enum(["TISCO", "TWEALTH", "TINSURE"]),
  amount: z.number().positive(),
  description: z.string().optional(),
  metadata: z.any().optional(),
  transactionRef: z.string().optional(),
  couponId: z.string().optional(),
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

export async function GET(req: Request) {
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

  await connectDB();
  const userId = decoded.userId;

  let credit = await Credit.findOne({ userId });
  if (!credit) {
    credit = await Credit.create({
      userId,
      tiscoPoint: 0,
      twealthPoint: 0,
      tinsurePoint: 0,
      totalPoints: 0,
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      tiscoPoint: credit.tiscoPoint,
      twealthPoint: credit.twealthPoint,
      tinsurePoint: credit.tinsurePoint,
      totalPoints: credit.totalPoints,
    },
  });
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
  const parsed = PointTxSchema.safeParse(body);
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
    action,
    pointType,
    amount,
    description,
    metadata,
    transactionRef,
    couponId,
  } = parsed.data;

  const field = pointField(pointType);
  const delta = action === "earn" ? amount : -amount;
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined;
  const userAgent = req.headers.get("user-agent") || undefined;

  try {
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

    let updatedCredit: any = null;

    if (action === "earn") {
      updatedCredit = await Credit.findOneAndUpdate(
        { userId },
        { $inc: { [field]: amount, totalPoints: amount } },
        { new: true },
      );
    } else {
      updatedCredit = await Credit.findOneAndUpdate(
        { userId, [field]: { $gte: amount } },
        { $inc: { [field]: -amount, totalPoints: -amount } },
        { new: true },
      );

      if (!updatedCredit) {
        const current = await Credit.findOne({ userId });

        await History.create({
          userId: new mongoose.Types.ObjectId(userId),
          type: HistoryType.POINT_SPEND,
          status: HistoryStatus.FAILED,
          couponId: couponId
            ? new mongoose.Types.ObjectId(couponId)
            : undefined,
          pointChange: buildPointChange(pointType, -amount),
          balanceAfter: buildBalanceAfter(current),
          description: description ?? "Insufficient balance",
          metadata: {
            ...(metadata ?? {}),
            reason: "insufficient_balance",
            pointType,
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
    }

    // success history
    await History.create({
      userId: new mongoose.Types.ObjectId(userId),
      type:
        action === "earn" ? HistoryType.POINT_EARN : HistoryType.POINT_SPEND,
      status: HistoryStatus.SUCCESS,
      couponId: couponId ? new mongoose.Types.ObjectId(couponId) : undefined,
      pointChange: buildPointChange(pointType, delta),
      balanceAfter: buildBalanceAfter(updatedCredit),
      description:
        description ?? (action === "earn" ? "Point earned" : "Point spent"),
      metadata: { ...(metadata ?? {}), pointType },
      transactionRef,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message:
        action === "earn"
          ? "Points added successfully"
          : "Points spent successfully",
      data: {
        tiscoPoint: updatedCredit.tiscoPoint,
        twealthPoint: updatedCredit.twealthPoint,
        tinsurePoint: updatedCredit.tinsurePoint,
        totalPoints: updatedCredit.totalPoints,
      },
    });
  } catch (error: any) {
    console.error("Point transaction error:", error);

    try {
      const current = await Credit.findOne({ userId });
      await History.create({
        userId: new mongoose.Types.ObjectId(userId),
        type:
          action === "earn" ? HistoryType.POINT_EARN : HistoryType.POINT_SPEND,
        status: HistoryStatus.FAILED,
        couponId: couponId ? new mongoose.Types.ObjectId(couponId) : undefined,
        pointChange: buildPointChange(pointType, delta),
        balanceAfter: buildBalanceAfter(current),
        description: description ?? "Transaction failed",
        metadata: { ...(metadata ?? {}), pointType, error: error?.message },
        transactionRef,
        ipAddress,
        userAgent,
      });
    } catch (e) {
      console.error("History write failed:", e);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process transaction",
        error: error?.message,
      },
      { status: 500 },
    );
  }
}

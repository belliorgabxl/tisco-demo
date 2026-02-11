import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import crypto from "crypto";

import { connectDB } from "@/libs/database";
import { verifyToken } from "@/libs/auth";

import { Credit } from "@/models/Credit";
import { Coupon, CouponStatus } from "@/models/Coupon";
import { UserCoupon } from "@/models/UserCoupon";
import { History, HistoryStatus, HistoryType } from "@/models/History";

import { REWARDS } from "@/resource/reward";
import type { PointType } from "@/resource/constant";

const RedeemSchema = z.object({
  rewardId: z.string().min(1),
  mode: z.enum(["now", "later"]),
});

function getAuthToken(req: Request) {
  return (
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.headers.get("cookie")?.match(/auth_token=([^;]+)/)?.[1] ||
    ""
  );
}

function pointField(pointType: PointType) {
  if (pointType === "TISCO") return "tiscoPoint";
  if (pointType === "TWEALTH") return "twealthPoint";
  return "tinsurePoint";
}

function buFromPointType(pointType: PointType) {
  if (pointType === "TISCO") return "tisco";
  if (pointType === "TWEALTH") return "twealth";
  return "tinsure";
}

export async function POST(req: Request) {
  const token = getAuthToken(req);
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = verifyToken(token);
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = RedeemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid input", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { rewardId } = parsed.data;
  const reward = REWARDS[rewardId];

  if (!reward) {
    return NextResponse.json({ success: false, message: "Reward not found" }, { status: 404 });
  }


  if (reward.rewardType !== "coupon" || reward.pointAction.mode !== "spend") {
    return NextResponse.json(
      { success: false, message: "This reward is not a coupon/spend type" },
      { status: 400 },
    );
  }

  const pt = reward.pointAction.pointType;
  const cost = reward.pointAction.amount;

  await connectDB();

  const userId = new mongoose.Types.ObjectId(decoded.userId);

  // --- get/create credit ---
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

  const field = pointField(pt);
  const current = Number((credit as any)[field] ?? 0);

  // --- check balance ---
  if (current < cost) {
    await History.create({
      userId,
      type: HistoryType.COUPON_REDEEM,
      status: HistoryStatus.FAILED,
      pointChange: {
        tiscoPoint: pt === "TISCO" ? -cost : 0,
        twealthPoint: pt === "TWEALTH" ? -cost : 0,
        tinsurePoint: pt === "TINSURE" ? -cost : 0,
      },
      balanceAfter: {
        tiscoPoint: Number(credit.tiscoPoint ?? 0),
        twealthPoint: Number(credit.twealthPoint ?? 0),
        tinsurePoint: Number(credit.tinsurePoint ?? 0),
      },
      description: `Redeem failed: insufficient ${pt} points`,
      metadata: { rewardId },
      ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json(
      { success: false, message: "Insufficient points" },
      { status: 400 },
    );
  }

  // --- ensure coupon catalog exists ---
  const now = new Date();
  let coupon = await Coupon.findOne({ rewardId });

  if (!coupon) {
    // demo: create coupon from reward config (ปรับตามจริงได้)
    coupon = await Coupon.create({
      rewardId,
      coupon_type: "voucher",
      stock: 999,
      status: CouponStatus.ACTIVE,
      expired: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

      title: reward.title,
      description: reward.desc,
      pointCost: cost,
      applicableBU: buFromPointType(pt),
      redeemedCount: 0,
      usedCount: 0,
      image: reward.image,
    });
  }

  if (coupon.status !== CouponStatus.ACTIVE) {
    return NextResponse.json({ success: false, message: "Coupon inactive" }, { status: 400 });
  }
  if (coupon.stock <= 0) {
    return NextResponse.json({ success: false, message: "Coupon out of stock" }, { status: 400 });
  }
  if (coupon.expired <= now) {
    return NextResponse.json({ success: false, message: "Coupon expired" }, { status: 400 });
  }


  (credit as any)[field] = current - cost;
  credit.totalPoints =
    Number(credit.tiscoPoint ?? 0) + Number(credit.twealthPoint ?? 0) + Number(credit.tinsurePoint ?? 0);
  await credit.save();

  // --- update coupon stock ---
  coupon.stock -= 1;
  coupon.redeemedCount += 1;
  await coupon.save();

  // --- create user coupon instance ---
  const code = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
  const qrToken = crypto.randomUUID();

  const userCoupon = await UserCoupon.create({
    userId,
    couponId: coupon._id,
    rewardId,
    title: coupon.title ?? reward.title,
    description: coupon.description ?? reward.desc,
    image: (coupon as any).image ?? reward.image,
    code,
    qrToken,
    expiresAt: coupon.expired,
    metadata: {
      rewardBadge: reward.badge,
      pointType: pt,
      pointCost: cost,
    },
  });

  // --- history success ---
  await History.create({
    userId,
    type: HistoryType.COUPON_REDEEM,
    status: HistoryStatus.SUCCESS,
    couponId: coupon._id,
    pointChange: {
      tiscoPoint: pt === "TISCO" ? -cost : 0,
      twealthPoint: pt === "TWEALTH" ? -cost : 0,
      tinsurePoint: pt === "TINSURE" ? -cost : 0,
    },
    balanceAfter: {
      tiscoPoint: Number(credit.tiscoPoint ?? 0),
      twealthPoint: Number(credit.twealthPoint ?? 0),
      tinsurePoint: Number(credit.tinsurePoint ?? 0),
    },
    description: `Redeem coupon: ${reward.title}`,
    metadata: { rewardId, userCouponId: String(userCoupon._id) },
    transactionRef: `REDEEM-${rewardId}-${Date.now()}`,
    ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  return NextResponse.json({
    success: true,
    data: {
      userCouponId: String(userCoupon._id),
      code: userCoupon.code,
      qrToken: userCoupon.qrToken,
      expiresAt: userCoupon.expiresAt,
    },
  });
}

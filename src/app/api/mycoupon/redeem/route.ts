import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import crypto from "crypto";

import { connectDB } from "@/libs/database";
import { verifyToken } from "@/libs/auth";

import { Credit } from "@/models/Credit";
import { Coupon, CouponStatus } from "@/models/Coupon";
import { UserCoupon, UserCouponStatus } from "@/models/UserCoupon";
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

function getClientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
}

/**
 * NOTE:
 * - later = save only (no spend, no stock, no history)
 * - now   = redeem/spend (spend + stock + history)
 */
export async function POST(req: Request) {
  const token = getAuthToken(req);
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  let decoded: any;
  try {
    decoded = verifyToken(token);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = RedeemSchema.safeParse(body);
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

  const { rewardId, mode } = parsed.data;
  const reward = REWARDS[rewardId];

  if (!reward) {
    return NextResponse.json(
      { success: false, message: "Reward not found" },
      { status: 404 },
    );
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
  const now = new Date();

  // --- ensure coupon catalog exists ---
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

  // basic validations (ใช้ร่วมกันทั้ง now/later เพื่อไม่ให้ save ของหมดอายุ/ปิดการขาย)
  if (coupon.status !== CouponStatus.ACTIVE) {
    return NextResponse.json(
      { success: false, message: "Coupon inactive" },
      { status: 400 },
    );
  }
  if (coupon.expired <= now) {
    return NextResponse.json(
      { success: false, message: "Coupon expired" },
      { status: 400 },
    );
  }

  /**
   * ✅ LATER: save only
   * - no credit spend
   * - no coupon stock update
   * - no history
   */
  if (mode === "later") {
    // optional: ถ้าอยากให้ save ได้แม้ stock = 0 ให้ลบเงื่อนไขนี้ออก
    if (coupon.stock <= 0) {
      return NextResponse.json(
        { success: false, message: "Coupon out of stock" },
        { status: 400 },
      );
    }

    // กันการกดซ้ำ: ถ้ามี userCoupon ของ reward นี้ที่ยังไม่หมดอายุและยังไม่ถูกใช้ ให้คืนตัวเดิม
    const existing = await UserCoupon.findOne({
      userId,
      rewardId: reward.id,
      expiresAt: { $gt: now },
      status: { $ne: UserCouponStatus.USED }, // ถ้า enum ไม่มี USED ก็ยังไม่พัง (Mongo จะ ignore unknown? ขึ้นกับ schema)
    }).sort({ createdAt: -1 });

    if (existing) {
      return NextResponse.json({
        success: true,
        data: {
          userCouponId: String(existing._id),
          couponCode: (existing as any).couponCode ?? undefined,
          qrText: (existing as any).qrText ?? undefined,
          expiresAt: existing.expiresAt,
          mode: "later",
          note: "Already saved",
        },
      });
    }

    const code = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
    const qrToken = crypto.randomUUID();

    // ถ้าคุณมี enum SAVED อยู่แล้ว จะใช้ SAVED
    // ถ้าไม่มี จะ fallback ไป REDEEMED (แนะนำให้เพิ่ม SAVED ทีหลังเพื่อความชัดเจน)
    const savedStatus =
      (UserCouponStatus as any).SAVED ?? UserCouponStatus.REDEEMED;

    const userCoupon = await UserCoupon.create({
      userId,

      couponId: coupon._id,
      rewardId: reward.id,
      rewardTitle: reward.title,
      rewardDesc: reward.desc,
      rewardImage: reward.image,

      pointType: pt,
      pointCost: cost,

      status: savedStatus,

      couponCode: code,
      qrText: `tisco-demo://coupon/${qrToken}`,

      expiresAt: coupon.expired,
      redeemedAt: new Date(),

      metadata: {
        rewardBadge: reward.badge,
        couponId: String(coupon._id),
        savedOnly: true, // ช่วยให้แยก later ชัด ๆ แม้ status จะเป็น REDEEMED
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        userCouponId: String(userCoupon._id),
        couponCode: (userCoupon as any).couponCode ?? code,
        qrText: (userCoupon as any).qrText ?? `tisco-demo://coupon/${qrToken}`,
        expiresAt: userCoupon.expiresAt,
        mode: "later",
      },
    });
  }

  /**
   * ✅ NOW: redeem/spend (ตัดแต้มจริง)
   * - spend credit
   * - decrement stock
   * - create history
   * - create userCoupon ACTIVE
   */
  const session = await mongoose.startSession();

  try {
    let resultData: any = null;

    await session.withTransaction(async () => {
      // --- get/create credit (in tx) ---
      let credit = await Credit.findOne({ userId }).session(session);

      if (!credit) {
        const created = await Credit.create(
          [
            {
              userId,
              tiscoPoint: 0,
              twealthPoint: 0,
              tinsurePoint: 0,
              totalPoints: 0,
            },
          ],
          { session },
        );
        credit = created[0];
      }

      const field = pointField(pt);
      const current = Number((credit as any)[field] ?? 0);

      // --- check balance ---
      if (current < cost) {
        // history failed (for NOW only)
        await History.create(
          [
            {
              userId,
              type: HistoryType.COUPON_REDEEM,
              status: HistoryStatus.FAILED,
              pointChange: {
                tiscoPoint: pt === "TISCO" ? -cost : 0,
                twealthPoint: pt === "TWEALTH" ? -cost : 0,
                tinsurePoint: pt === "TINSURE" ? -cost : 0,
              },
              balanceAfter: {
                tiscoPoint: Number((credit as any).tiscoPoint ?? 0),
                twealthPoint: Number((credit as any).twealthPoint ?? 0),
                tinsurePoint: Number((credit as any).tinsurePoint ?? 0),
              },
              description: `Redeem failed: insufficient ${pt} points`,
              metadata: { rewardId },
              ipAddress: getClientIp(req),
              userAgent: req.headers.get("user-agent") ?? undefined,
            },
          ],
          { session },
        );

        throw new Error("Insufficient points");
      }

      // --- re-check coupon inside tx (and stock) ---
      const updatedCoupon = await Coupon.findOneAndUpdate(
        {
          _id: coupon._id,
          status: CouponStatus.ACTIVE,
          stock: { $gt: 0 },
          expired: { $gt: now },
        },
        { $inc: { stock: -1, redeemedCount: 1 } },
        { new: true, session },
      );

      if (!updatedCoupon) {
        throw new Error("Coupon out of stock / inactive / expired");
      }

      // --- spend credit ---
      (credit as any)[field] = current - cost;
      credit.totalPoints =
        Number((credit as any).tiscoPoint ?? 0) +
        Number((credit as any).twealthPoint ?? 0) +
        Number((credit as any).tinsurePoint ?? 0);
      await credit.save({ session });

      // --- create user coupon instance (ACTIVE) ---
      const code = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
      const qrToken = crypto.randomUUID();

      const userCoupon = await UserCoupon.create(
        [
          {
            userId,

            couponId: updatedCoupon._id,
            rewardId: reward.id,
            rewardTitle: reward.title,
            rewardDesc: reward.desc,
            rewardImage: reward.image,

            pointType: pt,
            pointCost: cost,

            status: UserCouponStatus.ACTIVE,

            couponCode: code,
            qrText: `tisco-demo://coupon/${qrToken}`,

            expiresAt: updatedCoupon.expired,
            redeemedAt: new Date(),

            metadata: {
              rewardBadge: reward.badge,
              couponId: String(updatedCoupon._id),
            },
          },
        ],
        { session },
      );

      // --- history success (NOW only) ---
      await History.create(
        [
          {
            userId,
            type: HistoryType.COUPON_REDEEM,
            status: HistoryStatus.SUCCESS,
            couponId: updatedCoupon._id,
            pointChange: {
              tiscoPoint: pt === "TISCO" ? -cost : 0,
              twealthPoint: pt === "TWEALTH" ? -cost : 0,
              tinsurePoint: pt === "TINSURE" ? -cost : 0,
            },
            balanceAfter: {
              tiscoPoint: Number((credit as any).tiscoPoint ?? 0),
              twealthPoint: Number((credit as any).twealthPoint ?? 0),
              tinsurePoint: Number((credit as any).tinsurePoint ?? 0),
            },
            description: `Redeem coupon: ${reward.title}`,
            metadata: { rewardId, userCouponId: String(userCoupon[0]._id) },
            transactionRef: `REDEEM-${rewardId}-${Date.now()}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers.get("user-agent") ?? undefined,
          },
        ],
        { session },
      );

      resultData = {
        userCouponId: String(userCoupon[0]._id),
        couponCode: (userCoupon[0] as any).couponCode ?? code,
        qrText: (userCoupon[0] as any).qrText ?? `tisco-demo://coupon/${qrToken}`,
        expiresAt: userCoupon[0].expiresAt,
        mode: "now",
      };
    });

    return NextResponse.json({ success: true, data: resultData });
  } catch (e: any) {
    const message = e?.message ?? "Redeem failed";
    const status =
      message === "Insufficient points" ? 400 : 400;

    return NextResponse.json({ success: false, message }, { status });
  } finally {
    session.endSession();
  }
}

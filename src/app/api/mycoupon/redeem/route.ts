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
  rewardId: z.string().min(1), // รับได้ทั้ง key หรือ "1","2"
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

function resolveReward(input: string) {
  const direct = (REWARDS as any)[input];
  if (direct) return { rewardKey: input, reward: direct };
  const entries = Object.entries(REWARDS as any);
  const found = entries.find(
    ([, r]) => String((r as any)?.id) === String(input),
  );

  if (found) return { rewardKey: found[0], reward: found[1] };

  return { rewardKey: null as any, reward: null as any };
}

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

  const { rewardKey, reward } = resolveReward(rewardId);
  if (!reward) {
    return NextResponse.json(
      { success: false, message: "Reward not found" },
      { status: 404 },
    );
  }

  if (reward.rewardType !== "coupon") {
    return NextResponse.json(
      { success: false, message: "This reward is not a coupon type" },
      { status: 400 },
    );
  }

  // ✅ pointAction อาจยังไม่ชัวร์ → fallback ไป reward.points
  const pa = reward.pointAction ?? {
    mode: "spend",
    pointType: "TISCO",
    amount: Number(reward.points ?? 0),
  };

  if (pa.mode !== "spend") {
    return NextResponse.json(
      { success: false, message: "This reward is not a spend type" },
      { status: 400 },
    );
  }

  const pt = pa.pointType as PointType;
  const cost = Number(pa.amount ?? 0);

  await connectDB();

  const userId = new mongoose.Types.ObjectId(decoded.userId);
  const now = new Date();

  // --- ensure coupon catalog exists (ใช้ rewardKey เป็นตัวหลัก) ---
  let coupon = await Coupon.findOne({ rewardId: rewardKey });

  if (!coupon) {
    coupon = await Coupon.create({
      rewardId: rewardKey,
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

  // basic validations
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

  // ✅ กันกดซ้ำแบบ “ถ้ามีใบที่ยังใช้งาน/เก็บไว้” ให้คืนใบเดิม
  // ถ้าคุณอยากให้ซื้อได้หลายใบ ให้ลบ block นี้ออก
  const existing = await UserCoupon.findOne({
    userId,
    rewardId: reward.id, // ✅ คงรูปแบบเดิมของคุณ (reward.id)
    status: { $in: [UserCouponStatus.REDEEMED, UserCouponStatus.ACTIVE] },
  }).sort({ createdAt: -1 });

  if (existing) {
    // ถ้าเป็น ACTIVE แล้วหมดเวลา อันนี้ให้ปล่อยให้ /api/mycoupon/[id] ไปจัดการ expire
    return NextResponse.json({
      success: true,
      data: {
        userCouponId: String(existing._id),
        couponCode: (existing as any).couponCode ?? undefined,
        qrText: (existing as any).qrText ?? undefined,
        activatedAt: (existing as any).activatedAt ?? null,
        expiresAt: existing.expiresAt ?? null,
        mode: existing.status === UserCouponStatus.ACTIVE ? "now" : "later",
        note: "Already redeemed",
      },
    });
  }

  const session = await mongoose.startSession();

  try {
    let resultData: any = null;

    await session.withTransaction(async () => {
      // --- re-check & reserve stock inside tx ---
      const updatedCoupon = await Coupon.findOneAndUpdate(
        {
          _id: coupon._id,
          status: CouponStatus.ACTIVE,
          stock: { $gt: 0 },
          expired: { $gt: now },
        },
        { $inc: { stock: -1, redeemedCount: 1 } },
        { session, returnDocument: "after" },
      );

      if (!updatedCoupon) {
        throw new Error("Coupon out of stock / inactive / expired");
      }

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

      // --- spend points (ONLY if cost > 0) ---
      if (cost > 0) {
        const field = pointField(pt);
        const current = Number((credit as any)[field] ?? 0);

        if (current < cost) {
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
                metadata: { rewardId: rewardKey, mode },
                ipAddress: getClientIp(req),
                userAgent: req.headers.get("user-agent") ?? undefined,
              },
            ],
            { session },
          );
          throw new Error("Insufficient points");
        }

        (credit as any)[field] = current - cost;

        // totalPoints = sum
        credit.totalPoints =
          Number((credit as any).tiscoPoint ?? 0) +
          Number((credit as any).twealthPoint ?? 0) +
          Number((credit as any).tinsurePoint ?? 0);

        await credit.save({ session });
      }

      // --- create user coupon instance ---
      const code = crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 12)
        .toUpperCase();
      const qrToken = crypto.randomUUID();

      const isNow = mode === "now";
      const activeExpiresAt = isNow
        ? new Date(now.getTime() + 15 * 60 * 1000)
        : null;

      const createdUserCoupon = await UserCoupon.create(
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

            status: isNow ? UserCouponStatus.ACTIVE : UserCouponStatus.REDEEMED,

            couponCode: code,
            qrText: `tisco-demo://coupon/${qrToken}`,

            activatedAt: isNow ? now : null,
            expiresAt: isNow ? activeExpiresAt : null,

            redeemedAt: now,
            usedAt: null,

            metadata: {
              rewardKey,
              rewardBadge: reward.badge,
              couponId: String(updatedCoupon._id),
              couponValidUntil: updatedCoupon.expired,
              mode,
            },
          },
        ],
        { session },
      );

      // --- history success (ทั้ง now และ later) ---
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
            metadata: {
              rewardId: rewardKey,
              rewardKey,
              mode,
              userCouponId: String(createdUserCoupon[0]._id),
            },
            transactionRef: `REDEEM-${rewardKey}-${Date.now()}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers.get("user-agent") ?? undefined,
          },
        ],
        { session },
      );

      resultData = {
        userCouponId: String(createdUserCoupon[0]._id),
        couponCode: (createdUserCoupon[0] as any).couponCode ?? code,
        qrText:
          (createdUserCoupon[0] as any).qrText ??
          `tisco-demo://coupon/${qrToken}`,

        status: createdUserCoupon[0].status,
        activatedAt: (createdUserCoupon[0] as any).activatedAt ?? null,
        expiresAt: createdUserCoupon[0].expiresAt ?? null,

        // เอาไว้โชว์ในหน้า mycoupon ว่าคูปองรวมหมดวันไหน
        couponValidUntil: updatedCoupon.expired,

        mode,
      };
    });

    return NextResponse.json({ success: true, data: resultData });
  } catch (e: any) {
    const message = e?.message ?? "Redeem failed";
    const status = message === "Insufficient points" ? 400 : 400;
    return NextResponse.json({ success: false, message }, { status });
  } finally {
    session.endSession();
  }
}

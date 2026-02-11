import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/libs/database";
import { Coupon, CouponStatus } from "@/models/Coupon";
import { UserCoupon, UserCouponStatus } from "@/models/UserCoupon";
import { Credit } from "@/models/Credit";
import { verifyToken } from "@/libs/auth";
import { Types } from "mongoose";
import { logCouponRedeem } from "@/libs/utils/history-service";

const RedeemCouponSchema = z.object({
  pointType: z.enum(["tisco", "twealth", "tinsure"]),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authToken =
      req.headers.get("authorization")?.replace("Bearer ", "") ||
      req.headers.get("cookie")?.match(/auth_token=([^;]+)/)?.[1];
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const parsed = RedeemCouponSchema.safeParse(body);

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

    const { id } = await params;
    const { pointType } = parsed.data;
    const userId = decoded.userId;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon ID" },
        { status: 400 },
      );
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 },
      );
    }

    if (coupon.status !== CouponStatus.ACTIVE) {
      return NextResponse.json(
        { success: false, message: "Coupon is not active" },
        { status: 400 },
      );
    }

    if (new Date(coupon.expired) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Coupon has expired" },
        { status: 400 },
      );
    }

    if (coupon.stock <= 0) {
      return NextResponse.json(
        { success: false, message: "Coupon out of stock" },
        { status: 400 },
      );
    }

    const pointCost = coupon.pointCost || 0;

    if (
      pointCost > 0 &&
      coupon.applicableBU !== "all" &&
      coupon.applicableBU !== pointType
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `This coupon can only be redeemed with ${coupon.applicableBU} points`,
        },
        { status: 400 },
      );
    }

    const existingUserCoupon = await UserCoupon.findOne({
      userId,
      couponId: coupon._id,
      status: { $in: [UserCouponStatus.REDEEMED, UserCouponStatus.USED] },
    });

    if (existingUserCoupon) {
      return NextResponse.json(
        { success: false, message: "You have already redeemed this coupon" },
        { status: 400 },
      );
    }

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

    const pointField = `${pointType}Point` as
      | "tiscoPoint"
      | "twealthPoint"
      | "tinsurePoint";

    if (credit[pointField] < pointCost) {
      return NextResponse.json(
        { success: false, message: "Insufficient points" },
        { status: 400 },
      );
    }

    credit[pointField] -= pointCost;
    credit.totalPoints =
      credit.tiscoPoint + credit.twealthPoint + credit.tinsurePoint;
    await credit.save();

    coupon.stock -= 1;
    coupon.redeemedCount = (coupon.redeemedCount || 0) + 1;
    await coupon.save();

    const pointsSpent = {
      tiscoPoint: pointType === "tisco" ? pointCost : 0,
      twealthPoint: pointType === "twealth" ? pointCost : 0,
      tinsurePoint: pointType === "tinsure" ? pointCost : 0,
    };

    const userCoupon = await UserCoupon.create({
      userId,
      couponId: coupon._id,
      status: UserCouponStatus.REDEEMED,
      redeemedAt: new Date(),
      expiresAt: coupon.expired,
      pointsSpent,
      pointTypeUsed: pointType,
      metadata: {
        couponTitle: coupon.title,
        couponType: coupon.coupon_type,
        discountValue: coupon.discountValue,
        discountType: coupon.discountType,
      },
    });

    await logCouponRedeem(userId, coupon._id, pointsSpent, {
      userCouponId: userCoupon._id,
      couponTitle: coupon.title,
      couponType: coupon.coupon_type,
      pointType,
      uniqueCode: userCoupon.uniqueCode,
    });

    await userCoupon.populate("couponId");

    return NextResponse.json({
      success: true,
      message: "Coupon redeemed successfully",
      data: {
        userCoupon,
        uniqueCode: userCoupon.uniqueCode,
        remainingPoints: {
          tiscoPoint: credit.tiscoPoint,
          twealthPoint: credit.twealthPoint,
          tinsurePoint: credit.tinsurePoint,
          totalPoints: credit.totalPoints,
        },
        couponStock: coupon.stock,
      },
    });
  } catch (error: any) {
    console.error("Error redeeming coupon:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to redeem coupon",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

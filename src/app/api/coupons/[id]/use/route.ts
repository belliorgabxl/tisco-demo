import { NextResponse } from "next/server";
import { connectDB } from "@/libs/database";
import { Coupon, CouponStatus } from "@/models/Coupon";
import { UserCoupon, UserCouponStatus } from "@/models/UserCoupon";
import { verifyToken } from "@/libs/auth";
import { logCouponUse } from "@/libs/utils/history-service";

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

    await connectDB();

    const { id } = await params; // id is now uniqueCode
    const userId = decoded.userId;
    const uniqueCode = id;

    // Find UserCoupon by uniqueCode instead of _id
    const userCoupon = await UserCoupon.findOne({ uniqueCode }).populate(
      "couponId",
    );
    if (!userCoupon) {
      return NextResponse.json(
        { success: false, message: "Coupon not found with this unique code" },
        { status: 404 },
      );
    }

    // Verify ownership
    if (userCoupon.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "This coupon does not belong to you" },
        { status: 403 },
      );
    }

    // Check status is REDEEMED
    if (userCoupon.status !== UserCouponStatus.REDEEMED) {
      return NextResponse.json(
        { success: false, message: "Coupon is not in REDEEMED status" },
        { status: 400 },
      );
    }

    if (new Date(userCoupon.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Coupon has expired" },
        { status: 400 },
      );
    }

    // Update status
    userCoupon.status = UserCouponStatus.USED;
    userCoupon.usedAt = new Date();
    await userCoupon.save();

    // Update coupon template's
    const coupon = await Coupon.findById(userCoupon.couponId);
    if (coupon) {
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      await coupon.save();
    }

    // Log history
    await logCouponUse(userId, userCoupon.couponId, {
      userCouponId: userCoupon._id,
      couponTitle: userCoupon.metadata?.couponTitle,
      couponType: userCoupon.metadata?.couponType,
      discountValue: userCoupon.metadata?.discountValue,
      discountType: userCoupon.metadata?.discountType,
      uniqueCode: userCoupon.uniqueCode,
    });

    return NextResponse.json({
      success: true,
      message: "Coupon used successfully",
      data: userCoupon,
    });
  } catch (error: any) {
    console.error("Error using coupon:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to use coupon",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

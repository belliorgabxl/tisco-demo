import { NextResponse } from "next/server";
import { connectDB } from "@/libs/database";
import { verifyToken } from "@/libs/auth";
import { UserCoupon, UserCouponStatus } from "@/models/UserCoupon";

export async function GET(req: Request) {
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

    const userId = decoded.userId;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as UserCouponStatus | null;
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    const query: any = { userId };
    if (status) {
      query.status = status;
    } else {
      query.status = UserCouponStatus.REDEEMED;
    }

    const userCoupons = await UserCoupon.find(query)
      .populate({
        path: "couponId",
        select:
          "title description discountValue discountType minPurchase maxDiscount pointCost expired coupon_type",
      })
      .sort({ redeemedAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await UserCoupon.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: userCoupons,
      pagination: {
        total,
        limit,
        skip,
        hasMore: total > skip + limit,
      },
    });
  } catch (error: any) {
    console.error("Error fetching user coupons:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user coupons",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

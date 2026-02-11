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
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verifyToken(authToken);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const userId = decoded.userId;

    const items = await UserCoupon.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // normalize expired
    const now = new Date();
    const normalized = items.map((it: any) => {
      const isExpired = it.expiresAt && new Date(it.expiresAt).getTime() < now.getTime();
      if (isExpired && it.status === UserCouponStatus.ACTIVE) {
        return { ...it, status: UserCouponStatus.EXPIRED };
      }
      return it;
    });

    return NextResponse.json({ success: true, data: normalized }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/mycoupon error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load my coupon", error: error?.message },
      { status: 500 },
    );
  }
}

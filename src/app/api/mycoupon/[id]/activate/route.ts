import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/libs/database";
import { verifyToken } from "@/libs/auth";
import { UserCoupon, UserCouponStatus } from "@/models/UserCoupon";

function getAuthToken(req: Request) {
  return (
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.headers.get("cookie")?.match(/auth_token=([^;]+)/)?.[1] ||
    ""
  );
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // ✅ params เป็น Promise
) {
  const { id } = await params; // ✅ ต้อง await

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

  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid id" },
      { status: 400 },
    );
  }

  await connectDB();

  const userId = new mongoose.Types.ObjectId(decoded.userId);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);

  const updated = await UserCoupon.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      userId,
      status: UserCouponStatus.REDEEMED, // saved
    },
    {
      $set: {
        status: UserCouponStatus.ACTIVE,
        activatedAt: now,
        expiresAt,
        usedAt: null,
      },
    },
    { returnDocument: "after" }, 
  );

  if (!updated) {
    return NextResponse.json(
      { success: false, message: "Coupon cannot be activated" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true, data: updated });
}

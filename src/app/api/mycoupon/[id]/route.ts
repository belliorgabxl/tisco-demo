
import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { connectDB } from "@/libs/database";
import { verifyToken } from "@/libs/auth";
import { UserCoupon } from "@/models/UserCoupon";

function getAuthToken(req: Request) {
  return (
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.headers.get("cookie")?.match(/auth_token=([^;]+)/)?.[1] ||
    ""
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    await connectDB();

    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(decoded.userId);

    const doc = await UserCoupon.findOne({ _id: id, userId }).lean();
    if (!doc) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { ...doc, _id: String(doc._id) } });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: "Failed to load coupon", error: e?.message },
      { status: 500 },
    );
  }
}

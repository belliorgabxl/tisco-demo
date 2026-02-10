import { NextResponse } from "next/server";
import { connectDB } from "@/libs/database";
import { verifyToken } from "@/libs/auth";
import { getCouponHistory } from "@/libs/utils/history-service";
import { Types } from "mongoose";

export async function GET(
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

    try {
      verifyToken(authToken);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon ID" },
        { status: 400 },
      );
    }

    const history = await getCouponHistory(id, { limit, skip });

    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        limit,
        skip,
      },
    });
  } catch (error: any) {
    console.error("Error fetching coupon history:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch coupon history",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

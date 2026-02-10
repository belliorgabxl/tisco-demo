import { NextResponse } from "next/server";
import { connectDB } from "@/libs/database";
import { verifyToken } from "@/libs/auth";
import { getUserHistory } from "@/libs/utils/history-service";
import { HistoryType, HistoryStatus } from "@/models/History";

// GET /api/history - Get user's history
export async function GET(req: Request) {
  try {
    // Verify authentication
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

    const type = searchParams.get("type") as HistoryType | null;
    const status = searchParams.get("status") as HistoryStatus | null;
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    const options: any = { limit, skip };
    if (type) options.type = type;
    if (status) options.status = status;

    const history = await getUserHistory(userId, options);

    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        limit,
        skip,
      },
    });
  } catch (error: any) {
    console.error("Error fetching user history:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user history",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

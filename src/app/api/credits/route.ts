import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/libs/database";
import { Credit } from "@/models/Credit";
import { verifyToken } from "@/libs/auth";
import { logPointEarn } from "@/libs/utils/history-service";

const AddPointsSchema = z.object({
  tiscoPoint: z.number().min(0).optional().default(0),
  twealthPoint: z.number().min(0).optional().default(0),
  tinsurePoint: z.number().min(0).optional().default(0),
  description: z.string().optional(),
});

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

    return NextResponse.json({
      success: true,
      data: {
        tiscoPoint: credit.tiscoPoint,
        twealthPoint: credit.twealthPoint,
        tinsurePoint: credit.tinsurePoint,
        totalPoints: credit.totalPoints,
      },
    });
  } catch (error: any) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch credits",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
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

    const body = await req.json().catch(() => ({}));
    const parsed = AddPointsSchema.safeParse(body);

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

    const userId = decoded.userId;
    const { tiscoPoint, twealthPoint, tinsurePoint, description } = parsed.data;

    // Get or create credit
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

    // Add points
    credit.tiscoPoint += tiscoPoint;
    credit.twealthPoint += twealthPoint;
    credit.tinsurePoint += tinsurePoint;
    credit.totalPoints =
      credit.tiscoPoint + credit.twealthPoint + credit.tinsurePoint;
    await credit.save();

    // Log history if any points were added
    if (tiscoPoint > 0 || twealthPoint > 0 || tinsurePoint > 0) {
      await logPointEarn(
        userId,
        { tiscoPoint, twealthPoint, tinsurePoint },
        description || "Points added for testing",
        { source: "manual_add" },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Points added successfully",
      data: {
        tiscoPoint: credit.tiscoPoint,
        twealthPoint: credit.twealthPoint,
        tinsurePoint: credit.tinsurePoint,
        totalPoints: credit.totalPoints,
      },
    });
  } catch (error: any) {
    console.error("Error adding credits:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add credits",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

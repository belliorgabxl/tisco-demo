import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/libs/database";
import { Coupon, CouponStatus } from "@/models/Coupon";

// Schema for creating a coupon
const CreateCouponSchema = z.object({
  coupon_type: z.string().min(1).max(100),
  stock: z.number().int().min(0),
  status: z
    .enum([
      CouponStatus.ACTIVE,
      CouponStatus.INACTIVE,
      CouponStatus.EXPIRED,
      CouponStatus.SUSPENDED,
    ])
    .optional(),
  tierId: z.string().optional(),
  expired: z.string().datetime(),
  title: z.string().optional(),
  description: z.string().optional(),
  discountValue: z.number().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().optional(),
  pointCost: z.number().min(0).optional(),
  applicableBU: z.enum(["tisco", "twealth", "tinsure", "all"]).optional(),
});

// GET /api/coupons - List all coupons with filters
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tierId = searchParams.get("tierId");
    const coupon_type = searchParams.get("coupon_type");
    const applicableBU = searchParams.get("applicableBU");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (tierId) query.tierId = tierId;
    if (coupon_type) query.coupon_type = coupon_type;
    if (applicableBU) query.applicableBU = applicableBU;

    // Only show active coupons by default
    if (!status) {
      query.status = CouponStatus.ACTIVE;
      query.expired = { $gte: new Date() };
      query.stock = { $gt: 0 }; // มี stock เหลือ
    }

    const coupons = await Coupon.find(query)
      .populate("tierId")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Coupon.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: coupons,
      pagination: {
        total,
        limit,
        skip,
        hasMore: total > skip + limit,
      },
    });
  } catch (error: any) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch coupons",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// POST /api/coupons - Create a new coupon
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = CreateCouponSchema.safeParse(body);

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

    const coupon = await Coupon.create(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: "Coupon created successfully",
        data: coupon,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create coupon",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

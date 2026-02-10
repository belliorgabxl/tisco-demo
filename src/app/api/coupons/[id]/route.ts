import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/libs/database";
import { Coupon, CouponStatus } from "@/models/Coupon";
import { Types } from "mongoose";

const UpdateCouponSchema = z.object({
  coupon_type: z.string().min(1).max(100).optional(),
  stock: z.number().int().min(0).optional(),
  status: z
    .enum([
      CouponStatus.ACTIVE,
      CouponStatus.INACTIVE,
      CouponStatus.EXPIRED,
      CouponStatus.SUSPENDED,
    ])
    .optional(),
  tierId: z.string().optional(),
  expired: z.string().datetime().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  discountValue: z.number().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().optional(),
  pointCost: z.number().min(0).optional(),
  applicableBU: z.enum(["tisco", "twealth", "tinsure", "all"]).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon ID" },
        { status: 400 },
      );
    }

    const coupon = await Coupon.findById(id).populate("tierId");

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: coupon,
    });
  } catch (error: any) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch coupon",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = UpdateCouponSchema.safeParse(body);

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

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon ID" },
        { status: 400 },
      );
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true, runValidators: true },
    ).populate("tierId");

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update coupon",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon ID" },
        { status: 400 },
      );
    }

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
      data: coupon,
    });
  } catch (error: any) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete coupon",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

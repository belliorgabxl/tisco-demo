import { Schema, model, models } from "mongoose";

export enum CouponStatus {
  ACTIVE = "active", // คูปองพร้อมใช้งาน
  INACTIVE = "inactive", // ปิดการใช้งานชั่วคราว
  EXPIRED = "expired", // หมดอายุแล้ว
  SUSPENDED = "suspended", // ระงับการใช้งาน
}

const CouponSchema = new Schema(
  {
    coupon_type: {
      type: String,
      required: true,
      trim: true,
      // Examples: "discount", "cashback", "voucher" , "product"
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(CouponStatus),
      required: true,
      default: CouponStatus.ACTIVE,
      index: true,
    },

    tierId: {
      type: Schema.Types.ObjectId,
      ref: "Tier",
      required: false, // null = all tiers
      index: true,
    },

    expired: {
      type: Date,
      required: true,
      index: true,
    },

    title: { type: String, required: false },
    description: { type: String, required: false },
    discountValue: { type: Number, required: false }, // percentage or fixed amount
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: false,
    },
    minPurchase: { type: Number, required: false, default: 0 },
    maxDiscount: { type: Number, required: false }, // max discount cap for percentage

    // Point cost to redeem
    pointCost: { type: Number, required: false, default: 0 },

    // Which BU point can be used
    applicableBU: {
      type: String,
      enum: ["tisco", "twealth", "tinsure", "all"],
      default: "all",
    },

    // จำนวนที่ถูกแลกไปแล้ว (tracking)
    redeemedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // จำนวนที่ถูกใช้ไปแล้ว (tracking)
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

// Index for querying active coupons
CouponSchema.index({ status: 1, expired: 1 });
CouponSchema.index({ tierId: 1, status: 1 });

export const Coupon = models.Coupon || model("Coupon", CouponSchema);

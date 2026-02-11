// src/models/UserCoupon.ts
import { Schema, model, models } from "mongoose";

export const UserCouponStatus = {
  REDEEMED: "redeemed",
  ACTIVE: "active",
  USED: "used",
  EXPIRED: "expired",
  SUSPENDED: "suspended",
} as const;

export type UserCouponStatus =
  (typeof UserCouponStatus)[keyof typeof UserCouponStatus];

const UserCouponSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rewardId: { type: String, required: true, index: true },
    rewardTitle: { type: String, required: true },
    rewardDesc: { type: String, required: false },
    rewardImage: { type: String, required: false },

    pointType: {
      type: String,
      enum: ["TISCO", "TWEALTH", "TINSURE"],
      required: true,
    },
    pointCost: { type: Number, required: true, default: 0 },

    status: {
      type: String,
      enum: Object.values(UserCouponStatus),
      required: true,
      default: UserCouponStatus.REDEEMED,
      index: true,
    },

    couponCode: { type: String, required: false, index: true },
    qrText: { type: String, required: false },

    redeemedAt: { type: Date, required: true, default: Date.now },
    usedAt: { type: Date, required: false, default: null },

    activatedAt: { type: Date, required: false, default: null, index: true },
    expiresAt: { type: Date, required: false, default: null, index: true },

    usedReason: { type: String, required: false, default: "" },

    metadata: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true },
);

export const UserCoupon =
  models.UserCoupon || model("UserCoupon", UserCouponSchema);

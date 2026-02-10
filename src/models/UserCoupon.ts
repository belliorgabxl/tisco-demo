import { Schema, model, models } from "mongoose";

export enum UserCouponStatus {
  REDEEMED = "redeemed", // แลกแล้ว (เก็บไว้ใช้)
  USED = "used", // ใช้แล้ว
  EXPIRED = "expired", // หมดอายุก่อนใช้
  CANCELLED = "cancelled",
}

const UserCouponSchema = new Schema(
  {
    // เจ้าของคูปอง
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(UserCouponStatus),
      required: true,
      default: UserCouponStatus.REDEEMED,
      index: true,
    },

    redeemedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    usedAt: {
      type: Date,
      required: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    pointsSpent: {
      tiscoPoint: { type: Number, default: 0 },
      twealthPoint: { type: Number, default: 0 },
      tinsurePoint: { type: Number, default: 0 },
    },

    pointTypeUsed: {
      type: String,
      enum: ["tisco", "twealth", "tinsure"],
      required: true,
    },

    uniqueCode: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true },
);

UserCouponSchema.index({ userId: 1, status: 1, expiresAt: 1 });
UserCouponSchema.index({ couponId: 1, status: 1 });
UserCouponSchema.index({ userId: 1, couponId: 1 });

UserCouponSchema.pre("save", function () {
  if (!this.uniqueCode) {
    const randomNumber = Math.floor(Math.random() * 1000000000000)
      .toString()
      .padStart(12, "0");
    this.uniqueCode = `TIS-${randomNumber}`;
  }
});

export const UserCoupon =
  models.UserCoupon || model("UserCoupon", UserCouponSchema);

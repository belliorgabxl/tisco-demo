import { Schema, model, models } from "mongoose";

export enum HistoryType {
  COUPON_REDEEM = "coupon_redeem",
  COUPON_USE = "coupon_use",
  POINT_EARN = "point_earn",
  POINT_SPEND = "point_spend",
  POINT_TRANSFER = "point_transfer",
  TIER_UPGRADE = "tier_upgrade",
  TIER_DOWNGRADE = "tier_downgrade",
}

export enum HistoryStatus {
  SUCCESS = "success",
  FAILED = "failed",
  PENDING = "pending",
  CANCELLED = "cancelled",
}

const HistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(HistoryType),
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(HistoryStatus),
      required: true,
      default: HistoryStatus.SUCCESS,
    },

    // Reference to related entities
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
      index: true,
    },

    tierId: {
      type: Schema.Types.ObjectId,
      ref: "Tier",
      required: false,
    },

    // Point transaction details
    pointChange: {
      tiscoPoint: { type: Number, default: 0 },
      twealthPoint: { type: Number, default: 0 },
      tinsurePoint: { type: Number, default: 0 },
    },

    // Balance after transaction
    balanceAfter: {
      tiscoPoint: { type: Number, default: 0 },
      twealthPoint: { type: Number, default: 0 },
      tinsurePoint: { type: Number, default: 0 },
    },

    // Description and metadata
    description: { type: String, required: false },
    metadata: { type: Schema.Types.Mixed, required: false }, // Additional data

    // Transaction reference
    transactionRef: { type: String, required: false, index: true },

    // IP and location tracking
    ipAddress: { type: String, required: false },
    userAgent: { type: String, required: false },
  },
  { timestamps: true },
);

// Compound indexes for common queries
HistorySchema.index({ userId: 1, type: 1, createdAt: -1 });
HistorySchema.index({ userId: 1, status: 1, createdAt: -1 });
HistorySchema.index({ couponId: 1, createdAt: -1 });
HistorySchema.index({ createdAt: -1 }); // For date range queries

export const History = models.History || model("History", HistorySchema);

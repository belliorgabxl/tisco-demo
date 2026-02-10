import { History, HistoryType, HistoryStatus } from "@/models/History";
import { Credit } from "@/models/Credit";
import { Types } from "mongoose";

interface PointChange {
  tiscoPoint?: number;
  twealthPoint?: number;
  tinsurePoint?: number;
}

interface CreateHistoryOptions {
  userId: string | Types.ObjectId;
  type: HistoryType;
  status?: HistoryStatus;
  couponId?: string | Types.ObjectId;
  tierId?: string | Types.ObjectId;
  pointChange?: PointChange;
  description?: string;
  metadata?: any;
  transactionRef?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function getUserBalance(userId: string | Types.ObjectId) {
  const credit = await Credit.findOne({ userId });
  if (!credit) {
    return {
      tiscoPoint: 0,
      twealthPoint: 0,
      tinsurePoint: 0,
    };
  }
  return {
    tiscoPoint: credit.tiscoPoint,
    twealthPoint: credit.twealthPoint,
    tinsurePoint: credit.tinsurePoint,
  };
}

export async function createHistory(options: CreateHistoryOptions) {
  const {
    userId,
    type,
    status = HistoryStatus.SUCCESS,
    couponId,
    tierId,
    pointChange,
    description,
    metadata,
    transactionRef,
    ipAddress,
    userAgent,
  } = options;

  const balanceAfter = await getUserBalance(userId);

  const history = await History.create({
    userId,
    type,
    status,
    couponId,
    tierId,
    pointChange: pointChange || {
      tiscoPoint: 0,
      twealthPoint: 0,
      tinsurePoint: 0,
    },
    balanceAfter,
    description,
    metadata,
    transactionRef,
    ipAddress,
    userAgent,
  });

  return history;
}

export async function logCouponRedeem(
  userId: string | Types.ObjectId,
  couponId: string | Types.ObjectId,
  pointsSpent: PointChange,
  metadata?: any,
) {
  return createHistory({
    userId,
    type: HistoryType.COUPON_REDEEM,
    status: HistoryStatus.SUCCESS,
    couponId,
    pointChange: {
      tiscoPoint: -(pointsSpent.tiscoPoint || 0),
      twealthPoint: -(pointsSpent.twealthPoint || 0),
      tinsurePoint: -(pointsSpent.tinsurePoint || 0),
    },
    description: "Redeemed coupon with points",
    metadata,
  });
}

export async function logCouponUse(
  userId: string | Types.ObjectId,
  couponId: string | Types.ObjectId,
  metadata?: any,
) {
  return createHistory({
    userId,
    type: HistoryType.COUPON_USE,
    status: HistoryStatus.SUCCESS,
    couponId,
    description: "Used coupon",
    metadata,
  });
}

export async function logPointEarn(
  userId: string | Types.ObjectId,
  pointsEarned: PointChange,
  description?: string,
  metadata?: any,
) {
  return createHistory({
    userId,
    type: HistoryType.POINT_EARN,
    status: HistoryStatus.SUCCESS,
    pointChange: pointsEarned,
    description: description || "Earned points",
    metadata,
  });
}

export async function logPointSpend(
  userId: string | Types.ObjectId,
  pointsSpent: PointChange,
  description?: string,
  metadata?: any,
) {
  return createHistory({
    userId,
    type: HistoryType.POINT_SPEND,
    status: HistoryStatus.SUCCESS,
    pointChange: {
      tiscoPoint: -(pointsSpent.tiscoPoint || 0),
      twealthPoint: -(pointsSpent.twealthPoint || 0),
      tinsurePoint: -(pointsSpent.tinsurePoint || 0),
    },
    description: description || "Spent points",
    metadata,
  });
}

export async function getUserHistory(
  userId: string | Types.ObjectId,
  options?: {
    type?: HistoryType;
    status?: HistoryStatus;
    limit?: number;
    skip?: number;
  },
) {
  const query: any = { userId };

  if (options?.type) query.type = options.type;
  if (options?.status) query.status = options.status;

  return History.find(query)
    .populate("couponId")
    .populate("tierId")
    .sort({ createdAt: -1 })
    .limit(options?.limit || 50)
    .skip(options?.skip || 0);
}

export async function getCouponHistory(
  couponId: string | Types.ObjectId,
  options?: {
    limit?: number;
    skip?: number;
  },
) {
  return History.find({ couponId })
    .populate("userId", "username firstName lastName email")
    .sort({ createdAt: -1 })
    .limit(options?.limit || 50)
    .skip(options?.skip || 0);
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/libs/auth";
import { connectDB } from "@/libs/database";
import { User } from "@/models/User";
import { Credit } from "@/models/Credit";
import { Tier } from "@/models/Tier";
import mongoose from "mongoose";

async function resolveTierByPoints(points: number) {
  const tier = await Tier.findOne({ minPoints: { $lte: points } })
    .sort({ minPoints: -1 })
    .lean();
  return tier
    ? { key: tier.key, name: tier.name, minPoints: tier.minPoints }
    : null;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  try {
    const payload = verifyToken(token);

    await connectDB();

    const userId = new mongoose.Types.ObjectId(payload.userId);

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const credit = await Credit.findOne({ userId }).lean();
    const points = Number(credit?.points ?? 0);

    const tier = await resolveTierByPoints(points);

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          userId: String(user._id),
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          // avatarUrl: user.avatarUrl ?? "/data/person-user.png",
          memberNo: user.memberNo ?? `JP-${String(user._id).slice(-8)}`,
          points,
          tier: tier?.name ?? "Basic",
        },
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

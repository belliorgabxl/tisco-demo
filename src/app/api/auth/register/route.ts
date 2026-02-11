import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "@/models/User";
import { Credit } from "@/models/Credit";
import { connectDB } from "@/libs/database";

export const runtime = "nodejs";

const RegisterSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().max(200),
  dateOfBirth: z.string().min(1),
  nationality: z.string().max(80).optional().default(""),
  religion: z.string().max(80).optional().default(""),
  nationalId: z.string().max(30).optional().default(""),
  passportNumber: z.string().max(30).optional().default(""),
  consentAccepted: z.boolean(),
  policyVersion: z.string().optional().default("v1"),
});

async function canUseTransactions() {
  try {
    const db = mongoose.connection.db;
    if (!db) return false;

    const admin = db.admin();
    const info: any = await admin.command({ hello: 1 });
    return Boolean(info?.setName);
  } catch {
    return false;
  }
}

const DEFAULT_POINTS = {
  tiscoPoint: 500,
  twealthPoint: 1250,
  tinsurePoint: 4000,
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (!data.consentAccepted) {
      return NextResponse.json(
        { message: "Please accept Privacy Policy / Terms." },
        { status: 400 },
      );
    }

    if (!data.nationalId.trim() && !data.passportNumber.trim()) {
      return NextResponse.json(
        { message: "Please provide nationalId or passportNumber." },
        { status: 400 },
      );
    }

    const dob = new Date(data.dateOfBirth);
    if (Number.isNaN(dob.getTime())) {
      return NextResponse.json(
        { message: "Invalid dateOfBirth" },
        { status: 400 },
      );
    }

    await connectDB();

    const exists = await User.findOne({ username: data.username }).lean();
    if (exists) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const useTx = await canUseTransactions();

    if (useTx) {
      const session = await mongoose.startSession();
      try {
        let createdUserId: mongoose.Types.ObjectId | null = null;

        await session.withTransaction(async () => {
          const userDoc = await User.create(
            [
              {
                username: data.username,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                dateOfBirth: dob,
                nationality: data.nationality ?? "",
                religion: data.religion ?? "",
                nationalId: data.nationalId ?? "",
                passportNumber: data.passportNumber ?? "",
                consent: {
                  accepted: true,
                  acceptedAt: new Date(),
                  policyVersion: data.policyVersion ?? "v1",
                },
                avatarUrl: "/data/person-user.png",
              },
            ],
            { session },
          );

          createdUserId = userDoc[0]._id;

          await Credit.create(
            [
              {
                userId: createdUserId,
                ...DEFAULT_POINTS,
              },
            ],
            { session },
          );
        });

        return NextResponse.json(
          { ok: true, userId: String(createdUserId) },
          { status: 201 },
        );
      } finally {
        session.endSession();
      }
    }

    const user = await User.create({
      username: data.username,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      dateOfBirth: dob,
      nationality: data.nationality ?? "",
      religion: data.religion ?? "",
      nationalId: data.nationalId ?? "",
      passportNumber: data.passportNumber ?? "",
      consent: {
        accepted: true,
        acceptedAt: new Date(),
        policyVersion: data.policyVersion ?? "v1",
      },
      avatarUrl: "/data/person-user.png",
    });

    await Credit.updateOne(
      { userId: user._id },
      {
        $setOnInsert: {
          userId: user._id,
          ...DEFAULT_POINTS,
        },
      },
      { upsert: true },
    );

    return NextResponse.json(
      { ok: true, userId: String(user._id) },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("REGISTER_ERROR:", err);
    return NextResponse.json(
      {
        message: "Server error",
        detail:
          process.env.NODE_ENV !== "production"
            ? String(err?.message || err)
            : undefined,
      },
      { status: 500 },
    );
  }
}

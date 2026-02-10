import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/libs/database";
import { User } from "@/models/User";
import { signToken } from "@/libs/auth";

const LoginSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await connectDB();

  const { username, password } = parsed.data;
  const user = await User.findOne({ username });
  if (!user)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );

  const token = signToken({
    userId: String(user._id),
    username: user.username,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

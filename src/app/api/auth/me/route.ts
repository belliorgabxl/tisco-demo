import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/libs/auth";

export async function GET() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("auth_token")?.value;
  if (!token)
    return NextResponse.json({ authenticated: false }, { status: 200 });

  try {
    const payload = verifyToken(token);
    return NextResponse.json({
      authenticated: true,
      user: { userId: payload.userId, username: payload.username },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

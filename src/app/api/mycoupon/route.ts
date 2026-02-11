import { NextResponse } from "next/server";
import { connectDB } from "@/libs/database";
import { verifyToken } from "@/libs/auth";
import { UserCoupon, UserCouponStatus } from "@/models/UserCoupon";

/**
 * UI expects: "active" | "used" | "expired" | "suspended" | "saved"
 * DB enum likely: ACTIVE | USED | EXPIRED | SUSPENDED | REDEEMED | SAVED (optional)
 */
function normalizeStatus(raw: any) {
  const s = String(raw ?? "").toUpperCase();

  // later/save-only states
  if (s === "REDEEMED" || s === "SAVED") return "saved";

  // normal states
  if (s === "ACTIVE") return "active";
  if (s === "USED") return "used";
  if (s === "EXPIRED") return "expired";
  if (s === "SUSPENDED") return "suspended";

  // fallback (avoid showing "ระงับ" incorrectly)
  return "suspended";
}

export async function GET(req: Request) {
  try {
    const authToken =
      req.headers.get("authorization")?.replace("Bearer ", "") ||
      req.headers.get("cookie")?.match(/auth_token=([^;]+)/)?.[1];

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    let decoded: any;
    try {
      decoded = verifyToken(authToken);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    await connectDB();

    const userId = decoded.userId;

    const items = await UserCoupon.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();

    const normalized = items.map((it: any) => {
      const expiresAt = it.expiresAt ? new Date(it.expiresAt) : null;
      const isExpired = !!expiresAt && expiresAt.getTime() < now.getTime();

      const rawStatus = it.status;
      const uiStatus = normalizeStatus(rawStatus);

      const finalStatus =
        isExpired && (uiStatus === "active" || uiStatus === "saved")
          ? "expired"
          : uiStatus;

      return {
        ...it,
        status: finalStatus,
      };
    });

    return NextResponse.json({ success: true, data: normalized }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/mycoupon error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load my coupon", error: error?.message },
      { status: 500 },
    );
  }
}

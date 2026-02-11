import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

import { connectDB } from "@/libs/database";
import { verifyToken } from "@/libs/auth";
import { History } from "@/models/History";

function encodeCursor(createdAt: Date, id: string) {
  const payload = JSON.stringify({ t: createdAt.toISOString(), id });
  return Buffer.from(payload, "utf8").toString("base64");
}

function decodeCursor(cursor: string) {
  try {
    const raw = Buffer.from(cursor, "base64").toString("utf8");
    const obj = JSON.parse(raw);
    if (!obj?.t || !obj?.id) return null;
    const t = new Date(obj.t);
    if (Number.isNaN(t.getTime())) return null;
    return { t, id: String(obj.id) };
  } catch {
    return null;
  }
}

const QuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional().default(15),
  cursor: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const q = QuerySchema.safeParse({
      limit: url.searchParams.get("limit") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
    });

    if (!q.success) {
      return NextResponse.json(
        { success: false, message: "Invalid query", errors: q.error.flatten() },
        { status: 400 },
      );
    }

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

    const userId = new mongoose.Types.ObjectId(decoded.userId);

    const filter: any = { userId };

    if (q.data.type) filter.type = q.data.type;
    if (q.data.status) filter.status = q.data.status;

    if (q.data.cursor) {
      const c = decodeCursor(q.data.cursor);
      if (c) {
        const cursorId = new mongoose.Types.ObjectId(c.id);
        filter.$or = [
          { createdAt: { $lt: c.t } },
          { createdAt: c.t, _id: { $lt: cursorId } },
        ];
      }
    }

    const docs = await History.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(q.data.limit + 1)
      .lean();

    const hasMore = docs.length > q.data.limit;
    const items = hasMore ? docs.slice(0, q.data.limit) : docs;

    const nextCursor = hasMore
      ? encodeCursor(
          items[items.length - 1].createdAt,
          String(items[items.length - 1]._id),
        )
      : null;

    return NextResponse.json({
      success: true,
      data: items.map((h: any) => ({
        id: String(h._id),
        type: h.type,
        status: h.status,
        description: h.description ?? "",
        transactionRef: h.transactionRef ?? "",
        couponId: h.couponId ? String(h.couponId) : null,
        tierId: h.tierId ? String(h.tierId) : null,
        pointChange: h.pointChange ?? {
          tiscoPoint: 0,
          twealthPoint: 0,
          tinsurePoint: 0,
        },
        balanceAfter: h.balanceAfter ?? {
          tiscoPoint: 0,
          twealthPoint: 0,
          tinsurePoint: 0,
        },
        createdAt: h.createdAt,
      })),
      paging: { nextCursor },
    });
  } catch (error: any) {
    console.error("GET /api/history error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch history",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

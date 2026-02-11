import { PointType } from "@/resource/constant";
import { Balances, DEFAULT_BALANCES, MeResponse } from "@/resource/type";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function mapMeToBanner(data: any): MeResponse {
  const src = data?.user ?? data?.data?.user ?? data?.data ?? data;

  const first = String(src?.firstName ?? "").trim();
  const last = String(src?.lastName ?? "").trim();
  const name =
    String(src?.name ?? "").trim() ||
    [first].filter(Boolean).join(" ") ||
    "Member";

  const base: Record<PointType, number> = { TISCO: 0, TINSURE: 0, TWEALTH: 0 };

  if (src?.pointByType && typeof src.pointByType === "object") {
    base.TISCO = Number(src.pointByType.tiscoPoint ?? 0);
    base.TINSURE = Number(src.pointByType.tinsurePoint ?? 0);
    base.TWEALTH = Number(src.pointByType.twealthPoint ?? 0);
  } else if (Array.isArray(src?.credits)) {
    for (const c of src.credits) {
      const t = String(c?.creditType ?? "").toUpperCase();
      const amt = Number(c?.creditAmount ?? 0);

      if (t === "TISCO_POINT" || t === "TISCO" || t === "POINT")
        base.TISCO += amt;
      if (t === "TINSURE_POINT" || t === "TINSURE") base.TINSURE += amt;
      if (t === "TWEALTH_POINT" || t === "TWEALTH") base.TWEALTH += amt;
    }
  } else if (src?.points && typeof src.points === "object") {
    base.TISCO = Number(src.points.tisco ?? src.points.TISCO ?? 0);
    base.TINSURE = Number(src.points.tinsure ?? src.points.TINSURE ?? 0);
    base.TWEALTH = Number(src.points.twealth ?? src.points.TWEALTH ?? 0);
  } else {
    base.TISCO = Number(src?.points ?? 0);
  }

  return {
    name,
    tier: String(src?.tier?.name ?? src?.tier ?? "Member"),
    pointsByType: base,
    memberNo: String(src?.memberNo ?? "-"),
    avatarUrl: String(src?.avatarUrl ?? "/data/person-user-1.png"),
  };
}

export function mapMeToBalances(input: any): Balances {
  const DEFAULT_BALANCES: Balances = { TISCO: 0, TINSURE: 0, TWEALTH: 0 };
  if (!input) return DEFAULT_BALANCES;

  const u = input?.user ?? input?.data?.user ?? input?.data ?? input;
  const pbt = u?.pointByType;

  if (pbt && typeof pbt === "object") {
    return {
      TISCO: Number(pbt.tiscoPoint ?? 0),
      TINSURE: Number(pbt.tinsurePoint ?? 0),
      TWEALTH: Number(pbt.twealthPoint ?? 0),
    };
  }

  const maybeMe = input as MeResponse;
  if (maybeMe?.pointsByType && typeof maybeMe.pointsByType === "object") {
    return {
      TISCO: Number(maybeMe.pointsByType.TISCO ?? 0),
      TINSURE: Number(maybeMe.pointsByType.TINSURE ?? 0),
      TWEALTH: Number(maybeMe.pointsByType.TWEALTH ?? 0),
    };
  }

  return DEFAULT_BALANCES;
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatRemain(ms: number) {
  if (ms <= 0) return "หมดเวลา";
  const totalSec = Math.floor(ms / 1000);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;

  return `${mm}:${pad2(ss)}`;
}

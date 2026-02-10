"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Bell, ChevronRight, Crown, QrCode } from "lucide-react";
import { formatNumber } from "@/libs/utils/format";

type MeResponse = {
  name: string;
  tier: string;
  points: number;
  memberNo: string;
  avatarUrl: string;
};

function mapMeToBanner(data: any): MeResponse {
  const src = data?.user ?? data?.data?.user ?? data?.data ?? data;

  const first = String(src?.firstName ?? "").trim();
  const last = String(src?.lastName ?? "").trim();
  const name =
    String(src?.name ?? "").trim() ||
    [first, last].filter(Boolean).join(" ") ||
    "Member";

  return {
    name,
    tier: String(src?.tier?.name ?? src?.tier ?? "Member"),
    points: Number(src?.points ?? 0),
    memberNo: String(src?.memberNo ?? "-"),
    avatarUrl: String(src?.avatarUrl ?? "/data/person-user.png"),
  };
}


export default function UserBanner({
  meEndpoint = "/auth/me",
  onRedeem,
  onOpenQR,
  onOpenNotifications,
}: {
  meEndpoint?: string;
  onRedeem?: () => void;
  onOpenQR?: () => void;
  onOpenNotifications?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadMe() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(meEndpoint, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`auth/me failed (${res.status})`);
        }

        const json = await res.json();
        const mapped = mapMeToBanner(json);

        if (alive) setMe(mapped);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load profile");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadMe();
    return () => {
      alive = false;
    };
  }, [meEndpoint]);

  const content = useMemo(() => {
    if (loading) return <BannerSkeleton />;
    if (error) return <BannerError message={error} />;

    const user = me ?? {
      name: "Member",
      tier: "Member",
      points: 0,
      memberNo: "-",
      avatarUrl: "/data/person-user.png",
    };

    return (
      <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white ring-1 ring-white/15">
            <Image
              src={user.avatarUrl}
              alt="avatar"
              fill
              className="object-cover"
              sizes="56px"
              priority
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-base font-semibold tracking-tight text-white/95">
                {user.name}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-sky-100 ring-1 ring-white/15">
                <Crown className="h-3.5 w-3.5 text-sky-200" />
                {user.tier}
              </span>
            </div>
            <div className="mt-0.5 text-xs text-white/70">
              Member No: <span className="text-white/90">{user.memberNo}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenQR}
              className="rounded-2xl border border-white/15 bg-white/10 p-2.5 text-white/95 hover:bg-white/15 active:scale-[0.98]"
              aria-label="Open QR"
            >
              <QrCode className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative rounded-2xl border border-white/15 bg-white/10 p-2.5 text-white/95 hover:bg-white/15 active:scale-[0.98]"
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_0_3px_rgba(88,197,255,0.15)]" />
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/15 bg-gradient-to-br from-sky-300/20 via-blue-500/15 to-rose-400/10 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-white/75">
                Your Points
              </div>
              <div className="mt-1 text-3xl font-extrabold tracking-tight text-white/95">
                {formatNumber(user.points)}
              </div>
              <div className="mt-1 text-xs text-white/70">
                ใช้แลกของรางวัล / ส่วนลด / สิทธิ์พิเศษ
              </div>
            </div>

            <button
              type="button"
              onClick={onRedeem}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold 
                bg-white text-gray-900
                shadow-[0_18px_38px_rgba(45,110,255,0.28),0_8px_18px_rgba(88,197,255,0.14)]
                hover:-translate-y-px active:scale-[0.98] transition"
            >
              Redeem
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }, [loading, error, me, onRedeem, onOpenQR, onOpenNotifications]);

  return content;
}

function BannerSkeleton() {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl shadow-[0_14px_30px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-2xl bg-white/10 animate-pulse ring-1 ring-white/10" />
        <div className="flex-1">
          <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
          <div className="mt-2 h-3 w-52 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-2xl bg-white/10 animate-pulse ring-1 ring-white/10" />
          <div className="h-10 w-10 rounded-2xl bg-white/10 animate-pulse ring-1 ring-white/10" />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4">
        <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
        <div className="mt-2 h-8 w-40 rounded bg-white/10 animate-pulse" />
        <div className="mt-2 h-3 w-56 rounded bg-white/10 animate-pulse" />
        <div className="mt-4 h-10 w-28 rounded-2xl bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

function BannerError({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl shadow-[0_14px_30px_rgba(0,0,0,0.25)]">
      <div className="text-sm font-bold text-white/90">
        โหลดข้อมูลผู้ใช้ไม่สำเร็จ
      </div>
      <div className="mt-1 text-xs text-white/70">{message}</div>
      <div className="mt-3 text-xs text-white/70">
        (ถ้าเป็น 401 ให้พาไปหน้า Login หรือเช็ค cookie/token)
      </div>
    </div>
  );
}

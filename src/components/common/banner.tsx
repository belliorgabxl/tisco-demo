"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ChevronRight, Crown } from "lucide-react";
import { formatNumber, mapMeToBanner } from "@/libs/utils/format";
import { ACTIVE_POINT_TYPE_KEY, PointType } from "@/resource/constant";
import { usePathname, useRouter } from "next/navigation";
import { BannerError, BannerSkeleton } from "./loading-banner";
import { MeResponse } from "@/resource/type";

const POINT_TYPES: Array<{
  type: PointType;
  title: string;
  sub: string;
  logo: string;
}> = [
  {
    type: "TISCO",
    title: "Tisco",
    sub: "แต้มสะสม",
    logo: "/data/person-user-1.png",
  },
  {
    type: "TINSURE",
    title: "TInsure",
    sub: "แต้มประกัน",
    logo: "/data/person-user-2.png",
  },
  {
    type: "TWEALTH",
    title: "TWealth",
    sub: "แต้มลงทุน",
    logo: "/data/person-user-3.png",
  },
];

export default function UserBanner({
  meEndpoint = "/api/auth/me",
  // onRedeem,
  onOpenNotifications,
  onAccountChange,
}: {
  meEndpoint?: string;
  // onRedeem?: () => void;
  onOpenNotifications?: () => void;
  onAccountChange?: (next: PointType) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hideRedeemBtn = pathname === "/main/rewards";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);

  const [activeType, setActiveType] = useState<PointType>("TISCO");

  const [openSwitch, setOpenSwitch] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(
        ACTIVE_POINT_TYPE_KEY,
      ) as PointType | null;
      if (
        saved === "TISCO" ||
        saved === "TINSURE" ||
        saved === "TWEALTH" ||
        saved === "JPOINT"
      ) {
        setActiveType(saved);
      } else {
        sessionStorage.setItem(ACTIVE_POINT_TYPE_KEY, "TISCO");
      }
    } catch {}
  }, []);

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

        if (!res.ok) throw new Error(`auth/me failed (${res.status})`);

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
  }, [meEndpoint, reloadKey]);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpenSwitch(false);
    }
    if (openSwitch) document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [openSwitch]);

  const sortedPoints = useMemo(() => {
    return [...POINT_TYPES].sort((a, b) => {
      if (a.type === activeType) return -1;
      if (b.type === activeType) return 1;
      return 0;
    });
  }, [activeType]);

  const content = useMemo(() => {
    if (loading) return <BannerSkeleton />;
    if (error) return <BannerError message={error} />;

    const user = me ?? {
      name: "Member",
      tier: "Member",
      pointsByType: { TISCO: 0, TINSURE: 0, TWEALTH: 0 },
      memberNo: "-",
      avatarUrl: "/data/person-user-1.png",
    };

    const activePoints = user.pointsByType[activeType] ?? 0;
    const activeMeta =
      POINT_TYPES.find((x) => x.type === activeType) ?? POINT_TYPES[0];

    function switchType(next: PointType) {
      if (next === activeType) {
        setOpenSwitch(false);
        return;
      }

      setActiveType(next);
      setOpenSwitch(false);

      try {
        sessionStorage.setItem(ACTIVE_POINT_TYPE_KEY, next);
      } catch {}

      setReloadKey((k) => k + 1);

      onAccountChange?.(next);
    }

    return (
      <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div ref={wrapRef} className="relative z-[100] shrink-0">
            <button
              type="button"
              onClick={() => setOpenSwitch((v) => !v)}
              className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white ring-1 ring-white/15
                 hover:opacity-95 transition"
              aria-label="Switch account"
            >
              <Image
                src={activeMeta.logo}
                alt="avatar"
                fill
                className="object-cover"
                sizes="56px"
                priority
              />
            </button>

            {/* Dropdown (anchor ใต้ avatar) */}
            <div
              className={`absolute left-0 top-[calc(100%+10px)] w-[260px] z-[200]
                rounded-3xl border border-white/15 bg-[#07162F]/95 p-3 backdrop-blur-2xl
                shadow-[0_18px_45px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]
                origin-top-left transition-all duration-200 ease-out
                ${
                  openSwitch
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 -translate-y-2 scale-[0.98] pointer-events-none"
                }
              `}
            >
              <div className="px-1 text-xs font-semibold text-white/80">
                Switch Your Accounts
              </div>

              <div className="mt-2 space-y-2">
                {sortedPoints.map((p) => {
                  const isActive = p.type === activeType;

                  return (
                    <button
                      key={p.type}
                      type="button"
                      onClick={() => switchType(p.type)}
                      className={`w-full rounded-2xl border px-2.5 py-2 text-left transition
                              ${
                                isActive
                                  ? "border-white/25 bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                                  : "border-white/10 bg-white/10 hover:bg-white/15"
                              }
                            `}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`relative h-10 w-10 overflow-hidden rounded-2xl ring-1
                                  ${
                                    isActive
                                      ? "bg-white ring-white/20"
                                      : "bg-white/10 ring-white/10"
                                  }
                                `}
                        >
                          <Image
                            src={p.logo}
                            alt={p.title}
                            fill
                            sizes="40px"
                            className="object-cover h-10 w-10"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div
                              className={`truncate text-[12px] font-bold ${
                                isActive ? "text-white" : "text-white/90"
                              }`}
                            >
                              {p.title}
                            </div>

                            {isActive && (
                              <span className="shrink-0 rounded-full bg-green-300/50 px-2 py-0.5 text-[10px] font-bold text-sky-100 ring-1 ring-green-500/30">
                                Active Account
                              </span>
                            )}
                          </div>

                          <div
                            className={`truncate text-[10px] ${
                              isActive ? "text-white/70" : "text-white/60"
                            }`}
                          >
                            {p.sub}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* user info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-base font-semibold tracking-tight text-white/95">
                {user.name}
              </span>
             
            </div>
            <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-sky-100 ring-1 ring-white/15">
                <Crown className="h-3.5 w-3.5 text-sky-200" />
                {user.tier}
              </span>
          </div>

          {/* notification */}
          <button
            type="button"
            // onClick={() => setOpenSwitch((v) => !v)}
            className="rounded-2xl border border-white/15 bg-white p-1 text-white/95 hover:bg-white/15 active:scale-[0.98]"
            aria-label="Switch point type"
          >
            <div className="relative h-10 w-10">
              <Image
                src="/logo/tisco-logo.png"
                alt="point logo"
                fill
                className="object-contain"
                sizes="32px"
                priority
              />
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative rounded-2xl border border-white/15 bg-white/10 p-2.5 text-white/95 hover:bg-white/15 active:scale-[0.98]"
            aria-label="Open notifications"
          >
            <Bell className="h-7 w-7" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_0_3px_rgba(88,197,255,0.15)]" />
          </button>
        </div>

        <div className="mt-2 rounded-2xl border border-white/15 bg-gradient-to-br from-sky-300/20 via-blue-500/15 to-rose-400/10 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-white ">
                <span className="text-white text-lg px-3 py-0.5 bg-blue-500/70 rounded-3xl">
                  {activeMeta.title} Point
                </span>
              </div>
              <div className="mt-1 text-3xl font-extrabold tracking-tight text-white/95">
                {formatNumber(activePoints)}
              </div>
              <div className="mt-1 text-xs text-white/70">
                ใช้แลกของรางวัล <br /> ส่วนลด / สิทธิ์พิเศษ
              </div>
            </div>
            {!hideRedeemBtn && (
              <button
                type="button"
                onClick={() => router.push("/main/rewards")}
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold 
              bg-white text-blue-950
              shadow-[0_18px_38px_rgba(45,110,255,0.28),0_8px_18px_rgba(88,197,255,0.14)]
              hover:-translate-y-px active:scale-[0.98] transition"
                    >
                Redeem
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    loading,
    error,
    me,
    // onRedeem,
    onOpenNotifications,
    activeType,
    openSwitch,
    router,
  ]);

  return content;
}

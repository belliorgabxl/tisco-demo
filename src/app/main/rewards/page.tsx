"use client";

import UserBanner from "@/components/common/banner";
import { ACTIVE_POINT_TYPE_KEY, PointType } from "@/resource/constant";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { REWARDS } from "@/resource/reward";
import ThemeBackground from "@/components/theme-background";

export default function RewardPage() {
  const router = useRouter();
  const [activePointType, setActivePointType] = useState<PointType>("TISCO");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(ACTIVE_POINT_TYPE_KEY);
      const t = String(saved ?? "").toUpperCase();

      if (t === "TISCO" || t === "TINSURE" || t === "TWEALTH") {
        setActivePointType(t as PointType);
      } else {
        setActivePointType("TISCO");
        sessionStorage.setItem(ACTIVE_POINT_TYPE_KEY, "TISCO");
      }
    } catch {
      setActivePointType("TISCO");
    }
  }, []);

  const rewardCards = useMemo(() => {
    const order = [
      "free-coupon",
      "tisco-100-points",
      "coupon-10-points",
      "insurance-benefits",
      "wealth-lounge",
    ] as const;

    return order.map((id) => {
      const r = REWARDS[id];
      return {
        id: r.id,
        title: r.title,
        desc: r.desc,
        image: r.image,
        badge: r.badge,
        href: `/main/rewards/${r.id}`,
      };
    });
  }, []);

  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center px-4 py-4 text-sky-50">
      <ThemeBackground type={activePointType} /> 
      <section className="w-full max-w-[520px] relative pb-28">
        <div className="relative z-50">
          <UserBanner
            meEndpoint="/api/auth/me"
            onRedeem={() => console.log("redeem")}
            onOpenNotifications={() => console.log("open notifications")}
            onAccountChange={(next) => {
              setActivePointType(next);
              // router.refresh();
            }}
          />
        </div>

        {/* Rewards & Privileges */}
        <div className="mt-6 z-0 flex items-center justify-between">
          <div className="text-sm font-bold text-white/90">
            Rewards & Privileges
          </div>
          <button
            type="button"
            onClick={() => router.push("/rewards")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-200 hover:text-sky-100"
          >
            See all <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 z-0  grid grid-cols-2 gap-3">
          {rewardCards.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="group overflow-hidden rounded-3xl border border-white/15 bg-white/10 text-left backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
              hover:bg-white/15 active:scale-[0.995] transition"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              </div>

              <div className="p-4">
                <p className="text-xs text-white/60">{c.desc}</p>
                <div className="mt-2 grid gap-2 text-white/70">
                  <p className="text-sm text-white font-semibold">{c.title}</p>

                  <div className="inline-flex items-center justify-center gap animate-pulse rounded-3xl bg-white px-2 py-1 text-sm font-semibold text-blue-950">
                    Redeem
                    <ChevronRight className="h-5 w-5 transition group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm font-bold text-white/90">Quick Actions</div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { title: "Scan", sub: "QR", href: "/scan" },
            { title: "Transfer", sub: "Points", href: "/transfer" },
            { title: "Top up", sub: "Wallet", href: "/topup" },
            { title: "History", sub: "Transactions", href: "/history" },
          ].map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className="rounded-3xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl
                shadow-[0_14px_30px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)]
                hover:bg-white/15 active:scale-[0.99] transition"
            >
              <div className="text-sm font-extrabold text-white/90">
                {a.title}
              </div>
              <div className="mt-0.5 text-[11px] text-white/60">{a.sub}</div>
            </Link>
          ))}
        </div>

        {/* Missions / Earn more */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm font-bold text-white/90">
            Earn more points
          </div>
          <button
            type="button"
            onClick={() => router.push("/missions")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-200 hover:text-sky-100"
          >
            View all <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 grid gap-3">
          {[
            {
              title: "Daily Check-in",
              desc: "เช็คอินวันนี้ รับเพิ่ม 5 แต้ม",
              progress: 40,
              href: "/missions/daily-checkin",
            },
            {
              title: "Invite a friend",
              desc: "ชวนเพื่อนสมัคร รับสูงสุด 100 แต้ม",
              progress: 10,
              href: "/missions/invite",
            },
          ].map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl
                shadow-[0_14px_30px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)]
                hover:bg-white/15 active:scale-[0.99] transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold text-white/90">
                    {m.title}
                  </div>
                  <div className="mt-1 text-xs text-white/65">{m.desc}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-white/70" />
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white/70"
                  style={{ width: `${m.progress}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-white/55">
                Progress {m.progress}%
              </div>
            </Link>
          ))}
        </div>

        {/* Recommended for you (based on activePointType) */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm font-bold text-white/90">
            Recommended for {activePointType}
          </div>
          <button
            type="button"
            onClick={() => router.push("/rewards")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-200 hover:text-sky-100"
          >
            Explore <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3">
          {[
            {
              title:
                activePointType === "TINSURE"
                  ? "ประกันราคาพิเศษ"
                  : activePointType === "TWEALTH"
                    ? "สัมมนาลงทุนรอบพิเศษ"
                    : "ดีลร้านค้าพันธมิตร",
              desc:
                activePointType === "TINSURE"
                  ? "เหมาะกับสายประกัน"
                  : activePointType === "TWEALTH"
                    ? "เหมาะกับสายลงทุน"
                    : "เหมาะกับสายช้อป",
              href: "/main/rewards",
            },
          ].map((x) => (
            <Link
              key={x.title}
              href={x.href}
              className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/12 via-white/8 to-white/6 p-4 backdrop-blur-xl
                shadow-[0_14px_30px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)]
                hover:bg-white/15 active:scale-[0.99] transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-white/90">
                    {x.title}
                  </div>
                  <div className="mt-1 text-xs text-white/65">{x.desc}</div>
                </div>
                <div className="rounded-2xl bg-white px-3 py-2 text-xs font-extrabold text-blue-950">
                  View
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Latest / Announcements */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm font-bold text-white/90">Latest</div>
          <button
            type="button"
            onClick={() => router.push("/news")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-200 hover:text-sky-100"
          >
            See more <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 grid gap-2">
          {[
            { title: "โปรใหม่ประจำสัปดาห์", desc: "รวมดีลยอดฮิตในตอนนี้" },
            { title: "ปรับปรุงระบบ Wallet", desc: "การแสดงผลแต้มเร็วขึ้น" },
          ].map((n) => (
            <div
              key={n.title}
              className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl
                shadow-[0_14px_30px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <div className="text-sm font-extrabold text-white/90">
                {n.title}
              </div>
              <div className="mt-1 text-xs text-white/65">{n.desc}</div>
            </div>
          ))}
        </div>

        <style>{`button{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

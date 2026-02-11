"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  Search,
  Gift,
  TicketPercent,
  Sparkles,
  Star,
  Flame,
  Receipt,
  Component,
  Newspaper,
} from "lucide-react";
import UserBanner from "@/components/common/banner";
import { PointType } from "@/resource/constant";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [activePointType, setActivePointType] = useState<PointType>(() => {
    if (typeof window === "undefined") return "TISCO";
    const v = sessionStorage.getItem("activePointType") as PointType | null;
    return v === "TINSURE" || v === "TWEALTH" ? v : "TISCO";
  });
  const quickActions = useMemo(
    () => [
      {
        icon: <Newspaper className="h-5 w-5 text-blue-900" />,
        title: "News",
        subtitle: "ข่าวสาร  ",
        link: "/main/promotions",
      },
      {
        icon: <Gift className="h-5 w-5 text-blue-900" />,
        title: "Redeem",
        subtitle: "แลกของรางวัล",
        link: "/main/rewards",
      },
      {
        icon: <Component className="h-5 w-5 text-blue-900" />,
        title: "My Coupon",
        subtitle: "คูปองของฉัน",
        link: "/main/mycoupon",
      },
      {
        icon: <Receipt className="h-5 w-5 text-blue-900" />,
        title: "History",
        subtitle: "รายการล่าสุด",
        link: "/main/history",
      },
    ],
    [],
  );

  const promos = useMemo(
    () => [
      {
        tag: "HOT DEAL",
        title: "Double Points Weekend",
        desc: "รับแต้ม x2 เมื่อช้อปในหมวดที่ร่วมรายการ",
        meta: "ถึง 29 ก.พ. 2026",
      },
      {
        tag: "EXCLUSIVE",
        title: "Loyalty Lounge Privilege",
        desc: "สิทธิ์พิเศษเฉพาะสมาชิก Loyalty",
        meta: "จำนวนจำกัด/เดือน",
      },
      {
        tag: "FLASH",
        title: "Redeem 50% Off",
        desc: "ใช้แต้มแลกส่วนลดทันที สูงสุด 500.-",
        meta: "เริ่ม 20:00 วันนี้",
      },
    ],
    [],
  );

  const featuredServices = useMemo(
    () => [
      {
        icon: <TicketPercent className="h-5 w-5" />,
        title: "Coupons",
        desc: "คูปองทั้งหมด",
      },
      {
        icon: <Sparkles className="h-5 w-5" />,
        title: "Missions",
        desc: "ทำภารกิจรับแต้ม",
      },
      {
        icon: <Star className="h-5 w-5" />,
        title: "Tier Benefits",
        desc: "สิทธิ์ตามระดับสมาชิก",
      },
      {
        icon: <Flame className="h-5 w-5" />,
        title: "Hot Picks",
        desc: "แนะนำสำหรับคุณ",
      },
    ],
    [],
  );
  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center px-4 py-4 text-sky-50">
      <div
        aria-hidden
        className="absolute inset-0 -z-10
        bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(88,197,255,0.28),transparent_55%),radial-gradient(900px_500px_at_90%_25%,rgba(45,110,255,0.22),transparent_58%),linear-gradient(180deg,#07162F_0%,#061225_55%,#040A14_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-45
        [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)]
        [background-size:28px_28px]
        [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -top-44 -left-40 -z-10 h-[520px] w-[520px] blur-[2px]
        bg-[radial-gradient(circle_at_30%_30%,rgba(88,197,255,0.30),transparent_60%)]"
      />
      <div
        aria-hidden
        className="absolute -bottom-56 -right-48 -z-10 h-[560px] w-[560px] blur-[2px]
        bg-[radial-gradient(circle_at_60%_60%,rgba(45,110,255,0.26),transparent_62%)]"
      />

      {/* Page */}
      <section className="w-full max-w-[520px] relative pb-28">
        <div className="relative z-50">
          <UserBanner
            meEndpoint="/api/auth/me"
            onRedeem={() => console.log("redeem")}
            onOpenNotifications={() => console.log("open notifications")}
            onAccountChange={(next) => {
              setActivePointType(next);
              router.refresh();
            }}
          />
        </div>

        {/* Search */}
        <div className="mt-4 z-0 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-xl shadow-[0_14px_30px_rgba(0,0,0,0.25)]">
          <Search className="h-5 w-5 text-white/70" />
          <input
            className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/55 outline-none"
            placeholder="ค้นหาโปรโมชั่น / สิทธิพิเศษ / ร้านค้า"
          />
          <button className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/15">
            Filter
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 z-0 grid grid-cols-4 gap-2">
          {quickActions.map((a) => (
            <Link
              href={a.link}
              key={a.title}
              className="group rounded-2xl grid place-items-center border border-white/15 bg-white/10 px-2 py-3 text-left backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
              hover:bg-white/15 active:scale-[0.99] transition"
            >
              <div className="inline-flex h-9 w-9 items-center text-white/10 justify-center rounded-2xl bg-white ring-1 ring-white/15 group-hover:bg-white/15">
                {a.icon}
              </div>
              <div className="mt-2 text-[12px] font-bold text-white/90">
                {a.title}
              </div>
              <div className="mt-0.5 text-[10px] text-white/65">
                {a.subtitle}
              </div>
            </Link>
          ))}
        </div>

        {/* Promotions */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm font-bold text-white/90">
            Promotions for you
          </div>
          <Link href={"/main/promotions"} className="text-xs font-semibold text-sky-200 hover:text-sky-100">
            See all
          </Link>
        </div>

        <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
          {promos.map((p) => (
            <div
              key={p.title}
              className="min-w-[84%] snap-start rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-sky-100 ring-1 ring-white/15">
                  {p.tag}
                </span>
                <span className="text-[11px] text-white/65">{p.meta}</span>
              </div>
              <div className="mt-3 text-lg font-extrabold tracking-tight text-white/95">
                {p.title}
              </div>
              <div className="mt-1 text-sm text-white/75">{p.desc}</div>

              <div className="mt-4 flex items-center justify-between">
                <button className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white/85 hover:bg-white/15">
                  Details
                </button>
                <button className="inline-flex items-center gap-1 text-xs font-bold text-sky-200 hover:text-sky-100">
                  Use now <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm font-bold text-white/90">Explore</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {featuredServices.map((s) => (
            <button
              key={s.title}
              className="rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
              hover:bg-white/15 active:scale-[0.99] transition"
            >
              <div className="flex items-center gap-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-white/90">
                    {s.title}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-white/65">
                    {s.desc}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end text-white/70">
                <ChevronRight className="h-5 w-5" />
              </div>
            </button>
          ))}
        </div>

        {/* Feed / News */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm font-bold text-white/90">Updates</div>
          <button className="text-xs font-semibold text-sky-200 hover:text-sky-100">
            View more
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <button
              key={i}
              className="w-full rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
              hover:bg-white/15 active:scale-[0.995] transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-white/90">
                    {i === 1 && "สิทธิ์พิเศษใหม่สำหรับสมาชิกระดับสูง"}
                    {i === 2 && "ภารกิจประจำสัปดาห์: รับแต้มเพิ่ม"}
                    {i === 3 && "ร้านค้าใกล้คุณ: โปรแรงวันนี้"}
                    {i === 4 && "แคมเปญใหม่: ใช้แต้มแลกส่วนลด"}
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs text-white/65">
                    อัปเดตข่าวสาร/โปรโมชันและระบบต่าง ๆ ให้ผู้ใช้เห็นแบบ feed
                    ยาว ๆ กดเข้าไปดูรายละเอียดต่อได้
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-white/70" />
              </div>
            </button>
          ))}
        </div>

        {/* remove tap highlight */}
        <style>{`button{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

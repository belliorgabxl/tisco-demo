"use client";

import UserBanner from "@/components/common/banner";
import { PointType } from "@/resource/constant";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  Crown,
  Gift,
  ShieldCheck,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [activePointType, setActivePointType] = useState<PointType>("TISCO");

  const rewardCards = useMemo(
    () => [
      {
        title: "Free Coupon",
        desc: "แลกของรางวัล / ดีลเด็ด",
        image: "/data/reward/reward-1.png",
        onClick: () => router.push("/rewards"),
      },
      {
        title: "100 TISCO Points",
        desc: "สิทธิพิเศษตาม Tier",
        image: "/data/reward/reward-1.png",
        onClick: () => router.push("/privileges"),
      },
      {
        title: "10 TISCO Points",
        desc: "คูปองส่วนลดทั้งหมด",
        image: "/data/reward/reward-1.png",
        icon: <TicketPercent className="h-5 w-5" />,
        badge: "HOT",
        onClick: () => router.push("/coupons"),
      },
      {
        title: "Insurance Benefits",
        desc: "สิทธิ์ประกัน / แคมเปญ",
        image: "/data/reward/reward-1.png",
        icon: <ShieldCheck className="h-5 w-5" />,
        badge: "TInsure",
        onClick: () => router.push("/tinsure"),
      },
      {
        title: "Wealth Lounge",
        desc: "ดีลลงทุน / สัมมนา",
        image: "/data/reward/reward-1.png",
        icon: <Sparkles className="h-5 w-5" />,
        badge: "TWealth",
        onClick: () => router.push("/twealth"),
      },
    ],
    [router],
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

      <section className="w-full max-w-[520px] relative pb-28">
        <UserBanner
          meEndpoint="/api/auth/me"
          onRedeem={() => console.log("redeem")}
          onOpenNotifications={() => console.log("open notifications")}
          onAccountChange={(next) => {
            setActivePointType(next);
            router.refresh();
          }}
        />

        {/* Rewards & Privileges */}
        <div className="mt-6 flex items-center justify-between">
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

        <div className="mt-3 grid grid-cols-2 gap-3">
          {rewardCards.map((c) => (
            <button
              key={c.title}
              type="button"
              onClick={c.onClick}
              className="group overflow-hidden rounded-3xl border border-white/15 bg-white/10 text-left backdrop-blur-xl
        shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
        hover:bg-white/15 active:scale-[0.995] transition"
            >
              {/* Image header: no padding */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src={c.image || "/data/reward/reward-1.png"}
                  alt={c.title}
                  fill
                  sizes="(max-width: 520px) 50vw, 260px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  priority={false}
                />
                {/* optional overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              </div>

              {/* Content (padding only here) */}
              <div className="p-4">
                <p className="text-xs text-white/60">{c.desc}</p>

                <div className="mt-2 grid gap-2 text-white/70">
                  <p className="text-sm text-white font-semibold">{c.title}</p>

                  <div className="inline-flex items-center justify-center gap-1 rounded-3xl bg-white px-2 py-1 text-sm font-semibold text-blue-950">
                    Redeem
                    <ChevronRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <style>{`button{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

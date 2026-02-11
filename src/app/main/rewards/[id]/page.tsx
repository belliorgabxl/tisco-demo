import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Crown, Gift, ShieldCheck, Sparkles } from "lucide-react";
import RedeemButton from "./redeem-button";
import { RewardDetail, REWARDS } from "@/resource/reward";
import RedeemConfirm from "./redeem-button";

function getReward(id: string): RewardDetail {
  return (
    REWARDS[id] ?? {
      id,
      title: "Reward",
      desc: "ไม่พบข้อมูลของรางวัลนี้",
      image: "/data/reward/reward-1.png",
      badge: "UNKNOWN",
      points: 0,
      highlights: ["รายการนี้อาจถูกลบ หรือยังไม่เปิดใช้งาน"],
      howToUse: ["กลับไปหน้า Rewards แล้วลองเลือกรายการอื่น"],
    }
  );
}

export default async function RewardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reward = getReward(id);

  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center  py-4 text-sky-50">
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

      <section className="w-full max-w-[520px] relative pb-28">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/main/rewards"
            className="inline-flex items-center gap-2 rounded-2xl border ml-2 border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90
              backdrop-blur-xl hover:bg-white/15 active:scale-[0.99] transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="text-sm font-bold text-white/90 -translate-x-2">
            Reward Details
          </div>

          <div className="w-[76px]" />
        </div>

        {/* Card */}
        <div
          className="mt-2 overflow-hidden rounded-md border border-white/15 bg-white/10 backdrop-blur-xl
            shadow-[0_14px_30px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          {/* Hero image */}
          <div className="relative w-full aspect-[16/10]">
            <Image
              src={reward.image}
              alt={reward.title}
              fill
              sizes="(max-width: 520px) 100vw, 520px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            {/* badge */}
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-gray-300/25 bg-gray-300/25 px-3 py-1 text-lg font-bold text-white/90 backdrop-blur">
              {reward.badge === "VIP" ? (
                <Crown className="h-6 w-6 text-yellow-300" />
              ) : null}
              {reward.badge === "NEW" ? <Gift className="h-6 w-6" /> : null}
              {reward.badge === "TInsure" ? (
                <ShieldCheck className="h-6 w-6" />
              ) : null}
              {reward.badge === "TWealth" ? (
                <Sparkles className="h-6 w-6" />
              ) : null}
              {reward.badge ?? "REWARD"}
            </div>

            {/* points pill */}
            <div className="absolute right-4 top-4 rounded-full border border-blue-500/15 bg-gray-300/25 px-3 py-1 text-lg font-bold text-white/90 backdrop-blur">
              {reward.points} Points
            </div>
          </div>

          {/* Content */}
          <div className="px-3 py-1">
            <div className="text-lg justify-between flex items-center font-extrabold tracking-tight text-white/95">
              {reward.title}

              {reward.tier ? (
                <div className=" inline-flex items-center gap-2 rounded-2xl border border-sky-300/25 bg-sky-300/10 px-3 py-2 text-xs font-semibold text-sky-100">
                  ต้องมี Tier:{" "}
                  <span className="font-extrabold">{reward.tier}</span>
                </div>
              ) : null}
            </div>
            <div className="mt-1 text-sm text-white/75">{reward.desc}</div>

            {/* Highlights */}
            <div className="mt-3 rounded-lg border border-white/15 bg-white/10 p-4">
              <div className="text-xs font-extrabold text-white/85">
                Highlights
              </div>
              <ul className="mt-2 space-y-2 text-sm text-white/75">
                {reward.highlights.map((t, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-200/80" />
                    <span className="flex-1">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to use */}
            <div className="mt-3 rounded-lg border border-white/15 bg-white/10 p-4">
              <div className="text-xs font-extrabold text-white/85">
                How to use
              </div>
              <ol className="mt-2 space-y-2 text-sm text-white/75 list-decimal list-inside">
                {reward.howToUse.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ol>
            </div>

            {/* CTA */}
            <p className="mt-2 text-lg text-white w-full text-center animate-pulse">
              Free Coupon
            </p>
            <RedeemConfirm rewardId={reward.id} rewardTitle={reward.title} couponURL={reward.image} />
            <div className="mt-2 text-center text-[11px] text-white/55">
              * เพื่อสิทธิประโยชน์สูงสุด
              กรุณาอ่านเงื่อนไขและข้อกำหนดของรางวัลแต่ละรายการ
            </div>
          </div>
        </div>

        <style>{`button{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

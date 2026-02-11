"use client";
import { TierBadge, TierChip } from "@/components/common/tier";
import { TIER_GROUPS } from "@/resource/tier";
import { Sparkles, Star, ChevronRight, Info, Award, Eye } from "lucide-react";
import Image from "next/image";

export default function TierPage() {
  const [groupKey, setGroupKey] = React.useState<string>(TIER_GROUPS[0].key);
  const group = TIER_GROUPS.find((g) => g.key === groupKey) ?? TIER_GROUPS[0];

  const [tierIndex, setTierIndex] = React.useState<number>(0);

  React.useEffect(() => {
    setTierIndex(0);
  }, [groupKey]);

  const Icon = group.icon;
  const tier = group.tiers[tierIndex] ?? group.tiers[0];

  return (
    <div className="min-h-[100dvh] bg-[#070A10] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_90%_20%,rgba(99,102,241,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%,rgba(255,255,255,0.03))]" />
        <div className="absolute inset-0 opacity-[0.25] [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 pb-10 pt-8">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-sm text-white/70">
            <Award className="h-4 w-4" />
            <span>Tier Benefits</span>
            <ChevronRight className="h-4 w-4 opacity-60" />
            <span className="text-white/90">สิทธิ์ตามระดับสมาชิก</span>
          </div>

          <div className="my-1 border-t border-white/30"></div>

          <div className="flex justify-center items-center gap-3">
            <div
              className="relative flex justify-center items-center h-12 w-12 overflow-hidden rounded-full bg-white
                    "
            >
              <Image
                src="/logo/tisco-logo.png"
                width={100}
                height={100}
                alt="tisco-logo.png"
                className="h-12 w-12"
              />
            </div>
            <p>Tisco Loyalty Program</p>
          </div>

          <div className="my-1 border-t border-white/30"></div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                อธิบายระดับ Tier
              </h1>
              <p className="mt-1 text-sm text-white/70">
                แต่ละชนิดของ Point Account จะมี Tier ของตัวเองตามด้านล่าง
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <Info className="h-4 w-4 text-white/70" />
              <div className="text-xs text-white/70 leading-5">
                <div className="text-white/90">Tip</div>
                <div>เลือก “ประเภทแต้ม” เพื่อดู Tier</div>
              </div>
            </div>
          </div>
        </div>

        {/* Group selector */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TIER_GROUPS.map((g) => {
            const ActiveIcon = g.icon;
            const isActive = g.key === groupKey;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setGroupKey(g.key)}
                className={[
                  "group relative overflow-hidden rounded-3xl border p-4 text-left transition",
                  isActive
                    ? "border-white/20 bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/8",
                ].join(" ")}
              >
                <div
                  className={[
                    "absolute inset-0 opacity-0 transition-opacity",
                    isActive ? "opacity-100" : "group-hover:opacity-60",
                    "bg-gradient-to-br",
                    g.accent,
                  ].join(" ")}
                />
                <div className="relative flex items-start gap-3">
                  <div
                    className={["rounded-2xl border p-2", g.iconBg].join(" ")}
                  >
                    <ActiveIcon
                      className={["h-5 w-5", g.iconColor].join(" ")}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-base font-semibold">
                        {g.title}
                      </div>
                      {g.key === "tisco" ? (
                        <TierBadge text="Popular" />
                      ) : g.key === "twealth" ? (
                        <TierBadge text="Wealth" />
                      ) : (
                        <TierBadge text="Insure" />
                      )}
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs text-white/70">
                      {g.subtitle}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Left: tiers */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border  border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{group.title}</div>
                    <div className="text-xs text-white/70">เลือก Tier</div>
                  </div>
                </div>

                <div
                  className="relative flex justify-center items-center h-12 w-12 overflow-hidden 
                  rounded-full bg-white/70
                    "
                >
                  <Image
                    src="/logo/tisco-logo.png"
                    width={100}
                    height={100}
                    alt="tisco-logo.png"
                    className="h-12 w-12"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {group.tiers.map((t, idx) => (
                  <TierChip
                    key={t.name}
                    name={t.name}
                    tone={t.tone}
                    active={idx === tierIndex}
                    onClick={() => setTierIndex(idx)}
                  />
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{tier.name}</div>
                    <div className="mt-1 text-xs text-white/70">
                      {tier.desc}
                    </div>
                  </div>
                  {tier.tag ? (
                    <TierBadge
                      text={tier.tag}
                      variant={
                        tier.tag === "Top"
                          ? "top"
                          : tier.tag === "Elite"
                            ? "elite"
                            : "default"
                      }
                    />
                  ) : null}
                </div>

                <div className="mt-4 space-y-2 text-xs text-white/70">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span>ประเภทบัญชีแต้ม</span>
                    <span className="text-white/90">{group.title}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span>Tier ที่เลือก</span>
                    <span className="text-white/90">{tier.name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">สรุป Tier ทั้งหมด</div>
              <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-white/75">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="font-semibold text-white">TISCO Point</div>
                  <div className="mt-1">Platinum / Gold / Silver</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="font-semibold text-white">TWealth Point</div>
                  <div className="mt-1">Platinum Wealth / Private Wealth</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="font-semibold text-white">TInsure Point</div>
                  <div className="mt-1">Privilege / Normal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: benefits placeholder (สวย + พร้อมต่อยอด) */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">
                    สิทธิประโยชน์ (Benefits)
                  </div>
                  <div className="mt-1 text-xs text-white/70">
                    ส่วนนี้รองรับการใส่เงื่อนไข/รายการสิทธิ์ของแต่ละ Tier
                    ในอนาคต
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                  <Sparkles className="h-5 w-5 text-white/80" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  {
                    title: "สิทธิ์สะสมแต้ม",
                    desc: "แสดงรายละเอียดการได้รับแต้ม/โบนัสของ Tier นี้",
                  },
                  {
                    title: "สิทธิ์แลกของรางวัล",
                    desc: "แสดงระดับการเข้าถึงของรางวัล/แคมเปญ",
                  },
                  {
                    title: "สิทธิ์พิเศษ",
                    desc: "เช่น โปรโมชันเฉพาะกลุ่ม หรือบริการพรีเมียม",
                  },
                  {
                    title: "เงื่อนไขการคงระดับ",
                    desc: "เงื่อนไขการรักษา Tier หรืออัปเกรด/ดาวน์เกรด",
                  },
                ].map((b) => (
                  <div
                    key={b.title}
                    className="rounded-3xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                        <Star className="h-4 w-4 text-yellow-300" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{b.title}</div>
                        <div className="mt-1 text-xs text-white/70">
                          {b.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                    <Eye className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      กำลังดู: {group.title} • {tier.name}
                    </div>
                    <div className="mt-1 text-xs text-white/70">
                      ถ้าพร้อมแล้ว เดี๋ยวคุณบอก “benefits” ของแต่ละ tier มา
                      ผมจะวางเป็นรายการ + ไอคอน + ไฮไลต์แบบสวย ๆ ให้เลย
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional: FAQ */}
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold">FAQ</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="font-semibold">Tier คืออะไร?</div>
                  <div className="mt-1 text-xs text-white/70">
                    คือระดับสมาชิกที่แตกต่างกันในแต่ละประเภทบัญชีแต้ม
                    เพื่อกำหนดสิทธิประโยชน์ และเงื่อนไขต่าง ๆ
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="font-semibold">
                    ทำไมแต่ละ Point Account มี Tier ไม่เหมือนกัน?
                  </div>
                  <div className="mt-1 text-xs text-white/70">
                    เพราะแต่ละผลิตภัณฑ์/กลุ่มลูกค้าออกแบบสิทธิ์และระดับสมาชิกไม่เท่ากัน
                    จึงแยก tier ตามประเภทบัญชีแต้ม
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-white/50">
          © Tier Benefits • /main/tier
        </div>
      </div>
    </div>
  );
}

// NOTE: React import for Next.js App Router (TSX) — ensure React types available
import React from "react";

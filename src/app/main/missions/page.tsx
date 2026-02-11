"use client";

import React from "react";
import {
  Sparkles,
  Trophy,
  Gift,
  Flame,
  CheckCircle2,
  Clock3,
  ChevronRight,
  Search,
  Filter,
  Star,
  Crown,
} from "lucide-react";

type MissionStatus = "ongoing" | "completed" | "expired";

type Mission = {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  accent: string; // gradient bg
  reward: { points: number; badge?: string };
  progress: { current: number; total: number };
  status: MissionStatus;
  expiresAt?: string;
};

const MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "ล็อกอินรายวัน",
    desc: "เข้าใช้งานต่อเนื่องเพื่อรับโบนัส",
    icon: Flame,
    accent: "from-emerald-500/20 via-lime-500/10 to-transparent",
    reward: { points: 50, badge: "Daily" },
    progress: { current: 1, total: 1 },
    status: "completed",
  },
  {
    id: "m2",
    title: "ทำรายการแลกคะแนน 1 ครั้ง",
    desc: "ทำรายการแลก/ใช้แต้มสำเร็จ",
    icon: Trophy,
    accent: "from-sky-500/20 via-violet-500/10 to-transparent",
    reward: { points: 120, badge: "Bonus" },
    progress: { current: 0, total: 1 },
    status: "ongoing",
    expiresAt: "หมดเขต 7 วัน",
  },
  {
    id: "m3",
    title: "สะสมแต้มครบ 500",
    desc: "สะสมแต้มรวมให้ถึงเป้าหมาย",
    icon: Sparkles,
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
    reward: { points: 200, badge: "Milestone" },
    progress: { current: 320, total: 500 },
    status: "ongoing",
    expiresAt: "หมดเขต 30 วัน",
  },
  {
    id: "m4",
    title: "แลกรางวัลครั้งแรก",
    desc: "ลองแลกของรางวัลจาก Rewards",
    icon: Gift,
    accent: "from-fuchsia-500/20 via-pink-500/10 to-transparent",
    reward: { points: 150, badge: "Starter" },
    progress: { current: 0, total: 1 },
    status: "expired",
    expiresAt: "หมดเขตแล้ว",
  },
];

type RewardItem = {
  id: string;
  name: string;
  cost: number;
  tag?: string;
  accent: string;
};

const REWARDS: RewardItem[] = [
  {
    id: "r1",
    name: "ส่วนลด 50 บาท",
    cost: 300,
    tag: "Popular",
    accent: "from-emerald-500/20 via-lime-500/10 to-transparent",
  },
  {
    id: "r2",
    name: "คูปองส่งฟรี",
    cost: 500,
    tag: "Limited",
    accent: "from-sky-500/20 via-violet-500/10 to-transparent",
  },
  {
    id: "r3",
    name: "ของพรีเมียม (สุ่ม)",
    cost: 1200,
    tag: "Rare",
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
];

function formatNumber(n: number) {
  return new Intl.NumberFormat("th-TH").format(n);
}

function clampPct(cur: number, total: number) {
  if (!total) return 0;
  const pct = (cur / total) * 100;
  return Math.max(0, Math.min(100, pct));
}

function StatusPill({ status }: { status: MissionStatus }) {
  const base = "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs";
  if (status === "completed")
    return (
      <span className={`${base} bg-emerald-500/10 border-emerald-400/25 text-emerald-200`}>
        <CheckCircle2 className="h-3.5 w-3.5" />
        Completed
      </span>
    );
  if (status === "expired")
    return (
      <span className={`${base} bg-rose-500/10 border-rose-400/25 text-rose-200`}>
        <Clock3 className="h-3.5 w-3.5" />
        Expired
      </span>
    );
  return (
    <span className={`${base} bg-white/5 border-white/10 text-white/80`}>
      <Clock3 className="h-3.5 w-3.5 opacity-80" />
      Ongoing
    </span>
  );
}

function TagBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
      <Star className="h-3.5 w-3.5 opacity-70" />
      {text}
    </span>
  );
}

export default function MissionPage() {
  const [tab, setTab] = React.useState<"all" | "ongoing" | "completed">("all");
  const [q, setQ] = React.useState("");
  const [pickedRewardId, setPickedRewardId] = React.useState(REWARDS[0].id);

  // demo summary (ต่อ API ทีหลัง)
  const summary = React.useMemo(
    () => ({
      points: 12500,
      coins: 780,
      streakDays: 5,
      levelName: "Supreme",
    }),
    [],
  );

  const filtered = React.useMemo(() => {
    const text = q.trim().toLowerCase();
    return MISSIONS.filter((m) => {
      if (tab === "ongoing" && m.status !== "ongoing") return false;
      if (tab === "completed" && m.status !== "completed") return false;

      if (!text) return true;
      return (
        m.title.toLowerCase().includes(text) || m.desc.toLowerCase().includes(text)
      );
    });
  }, [tab, q]);

  const pickedReward = React.useMemo(
    () => REWARDS.find((r) => r.id === pickedRewardId) ?? REWARDS[0],
    [pickedRewardId],
  );

  const canRedeem = summary.coins >= pickedReward.cost;

  return (
    <div className="min-h-[100dvh] bg-[#070A10] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_90%_20%,rgba(99,102,241,0.14),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%,rgba(255,255,255,0.03))]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-sm text-white/70">
              <Sparkles className="h-4 w-4" />
              <span>Missions</span>
              <ChevronRight className="h-4 w-4 opacity-60" />
              <span className="text-white/90">ทำภารกิจเพื่อแลกของ</span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              ภารกิจของฉัน
            </h1>
            <p className="mt-1 text-sm text-white/70">
              ทำภารกิจให้สำเร็จเพื่อรับแต้ม/เหรียญ แล้วนำไปแลกรางวัล
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <Crown className="h-4 w-4 text-white/80" />
            <div className="text-xs text-white/70 leading-5">
              <div className="text-white/90">{summary.levelName}</div>
              <div>Keep going 🔥</div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-transparent" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-xs text-white/70">Points</div>
                <div className="mt-1 text-xl font-semibold">
                  {formatNumber(summary.points)}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                <Trophy className="h-5 w-5 text-white/80" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/15 to-transparent" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-xs text-white/70">Coins (Redeem)</div>
                <div className="mt-1 text-xl font-semibold">
                  {formatNumber(summary.coins)}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                <Gift className="h-5 w-5 text-white/80" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 to-transparent" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-xs text-white/70">Streak</div>
                <div className="mt-1 text-xl font-semibold">
                  {summary.streakDays} วัน
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                <Flame className="h-5 w-5 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              className={[
                "rounded-full border px-4 py-2 text-sm transition",
                tab === "all"
                  ? "bg-white/12 border-white/20"
                  : "bg-white/5 border-white/10 text-white/75 hover:bg-white/8",
              ].join(" ")}
              onClick={() => setTab("all")}
              type="button"
            >
              ทั้งหมด
            </button>
            <button
              className={[
                "rounded-full border px-4 py-2 text-sm transition",
                tab === "ongoing"
                  ? "bg-white/12 border-white/20"
                  : "bg-white/5 border-white/10 text-white/75 hover:bg-white/8",
              ].join(" ")}
              onClick={() => setTab("ongoing")}
              type="button"
            >
              กำลังทำ
            </button>
            <button
              className={[
                "rounded-full border px-4 py-2 text-sm transition",
                tab === "completed"
                  ? "bg-white/12 border-white/20"
                  : "bg-white/5 border-white/10 text-white/75 hover:bg-white/8",
              ].join(" ")}
              onClick={() => setTab("completed")}
              type="button"
            >
              สำเร็จแล้ว
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <Search className="h-4 w-4 text-white/60" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ค้นหาภารกิจ..."
                className="w-56 bg-transparent text-sm outline-none placeholder:text-white/40"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75 hover:bg-white/8"
              onClick={() => {
                // placeholder: เปิด filter modal ในอนาคต
              }}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Missions list */}
          <div className="lg:col-span-3 space-y-3">
            {filtered.map((m) => {
              const pct = clampPct(m.progress.current, m.progress.total);
              const Icon = m.icon;

              return (
                <div
                  key={m.id}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${m.accent}`} />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                        <Icon className="h-5 w-5 text-white/85" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-semibold">{m.title}</div>
                          {m.reward.badge ? <TagBadge text={m.reward.badge} /> : null}
                          <StatusPill status={m.status} />
                        </div>
                        <div className="mt-1 text-xs text-white/70">{m.desc}</div>

                        {/* Progress */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-white/70">
                            <span>
                              Progress: {m.progress.current}/{m.progress.total}
                            </span>
                            {m.expiresAt ? <span>{m.expiresAt}</span> : <span />}
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-black/20">
                            <div
                              className="h-full rounded-full bg-white/60"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-xs text-white/70">Reward</div>
                      <div className="mt-1 inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                        <Trophy className="h-4 w-4 text-white/80" />
                        <span className="text-sm font-semibold">
                          +{formatNumber(m.reward.points)}
                        </span>
                      </div>

                      <div className="mt-2">
                        <button
                          type="button"
                          disabled={m.status !== "ongoing"}
                          className={[
                            "w-full rounded-2xl px-3 py-2 text-sm transition border",
                            m.status === "ongoing"
                              ? "border-white/15 bg-white/10 hover:bg-white/14"
                              : "border-white/10 bg-white/5 text-white/50 cursor-not-allowed",
                          ].join(" ")}
                          onClick={() => {
                            // placeholder: ไปหน้า mission detail / ทำ action
                          }}
                        >
                          ดูรายละเอียด
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
                ไม่พบภารกิจที่ตรงกับการค้นหา
              </div>
            ) : null}
          </div>

          {/* Rewards panel */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Rewards</div>
                  <div className="mt-1 text-xs text-white/70">
                    เลือกรางวัลแล้วกดแลกด้วย Coins
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                  <Gift className="h-5 w-5 text-white/80" />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {REWARDS.map((r) => {
                  const active = r.id === pickedRewardId;
                  const afford = summary.coins >= r.cost;

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setPickedRewardId(r.id)}
                      className={[
                        "relative w-full overflow-hidden rounded-3xl border p-4 text-left transition",
                        active
                          ? "border-white/20 bg-white/10"
                          : "border-white/10 bg-black/20 hover:bg-white/8",
                      ].join(" ")}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${r.accent} opacity-80`} />
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-sm font-semibold">{r.name}</div>
                            {r.tag ? <TagBadge text={r.tag} /> : null}
                            {!afford ? (
                              <span className="inline-flex items-center rounded-full border border-rose-400/25 bg-rose-500/10 px-2.5 py-1 text-[11px] text-rose-200">
                                Coins ไม่พอ
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75">
                            <span>Cost</span>
                            <span className="text-white/95 font-semibold">
                              {formatNumber(r.cost)}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                          <Crown className="h-5 w-5 text-white/80" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Selected</span>
                  <span className="font-semibold">{pickedReward.name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-white/70">Cost</span>
                  <span className="font-semibold">{formatNumber(pickedReward.cost)}</span>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    disabled={!canRedeem}
                    className={[
                      "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition border",
                      canRedeem
                        ? "border-white/15 bg-white/10 hover:bg-white/14"
                        : "border-white/10 bg-white/5 text-white/50 cursor-not-allowed",
                    ].join(" ")}
                    onClick={() => {
                      // placeholder: call redeem API
                      // e.g. POST /api/rewards/redeem { rewardId: pickedReward.id }
                    }}
                  >
                    แลกของรางวัล
                  </button>
                  <div className="mt-2 text-xs text-white/60">
                    * หน้านี้เป็น UI template — ต่อ API / business rule ได้ทีหลัง
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold">How it works</div>
              <div className="mt-3 space-y-2 text-xs text-white/70">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  1) ทำภารกิจให้สำเร็จเพื่อรับแต้ม/เหรียญ
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  2) สะสม Coins ให้พอ แล้วเลือก Rewards ที่ต้องการ
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  3) กด “แลกของรางวัล” เพื่อทำรายการแลก
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-white/50">
          © Missions • /main/mission
        </div>
      </div>
    </div>
  );
}

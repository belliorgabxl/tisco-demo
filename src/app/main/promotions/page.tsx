"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Flame,
  Zap,
  ShieldCheck,
  Timer,
} from "lucide-react";
import type { PointType } from "@/resource/constant";
import { Promotion, PROMOTIONS, PromotionTag } from "@/resource/promotions";

type TabKey = "for-you" | "all" | "upcoming" | "expiring";

function parseDate(d: string) {
  const t = new Date(d).getTime();
  return Number.isNaN(t) ? null : new Date(t);
}
function nowMs() {
  return Date.now();
}
function daysLeft(endAt: string) {
  const d = parseDate(endAt);
  if (!d) return null;
  const diff = d.getTime() - nowMs();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function TagIcon({ tag }: { tag: PromotionTag }) {
  if (tag === "HOT DEAL") return <Flame className="h-3.5 w-3.5" />;
  if (tag === "FLASH") return <Zap className="h-3.5 w-3.5" />;
  if (tag === "EXCLUSIVE") return <Sparkles className="h-3.5 w-3.5" />;
  if (tag === "NEW") return <ShieldCheck className="h-3.5 w-3.5" />;
  return <Sparkles className="h-3.5 w-3.5" />;
}

function isPointType(v: any): v is PointType {
  return v === "TISCO" || v === "TINSURE" || v === "TWEALTH";
}

export default function PromotionPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<TabKey>("for-you");
  const [activePointType, setActivePointType] = useState<PointType>("TISCO");

  useEffect(() => {
    try {
      const v = sessionStorage.getItem("activePointType");
      if (isPointType(v)) setActivePointType(v);
    } catch {}
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const n = nowMs();

    function matchQuery(p: Promotion) {
      if (!query) return true;
      const blob = `${p.title} ${p.desc} ${p.tag} ${p.bu}`.toLowerCase();
      return blob.includes(query);
    }

    function matchTab(p: Promotion) {
      const s = parseDate(p.startAt)?.getTime() ?? 0;
      const e = parseDate(p.endAt)?.getTime() ?? 0;

      if (tab === "all") return true;
      if (tab === "for-you") return p.bu === "ALL" || p.bu === activePointType;
      if (tab === "upcoming") return s > n;
      if (tab === "expiring") return e > n && e - n <= 1000 * 60 * 60 * 24 * 7; // 7 days
      return true;
    }

    return PROMOTIONS.filter((p) => matchQuery(p) && matchTab(p)).sort(
      (a, b) => {
        const aS = parseDate(a.startAt)?.getTime() ?? 0;
        const bS = parseDate(b.startAt)?.getTime() ?? 0;
        return bS - aS;
      },
    );
  }, [q, tab, activePointType]);

  const hero = useMemo(() => PROMOTIONS.slice(0, 3), []);

  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center px-4 py-4 text-sky-50">
      {/* bg */}
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
            href="/main/home"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90
              backdrop-blur-xl hover:bg-white/15 active:scale-[0.99] transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="text-sm font-bold text-white/90">Promotions</div>
          <div className="w-[76px]" />
        </div>

        {/* Hero carousel */}
        <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
          {hero.map((p) => {
            const left = daysLeft(p.endAt);
            return (
              <Link
                key={p.id}
                href={`/main/promotions/${p.id}`}
                className="relative min-w-[86%] snap-start overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl
                shadow-[0_14px_30px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]
                hover:bg-white/15 active:scale-[0.995] transition"
              >
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                </div>

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-extrabold text-white/90 backdrop-blur">
                  <TagIcon tag={p.tag} />
                  {p.tag}
                </div>

                {left !== null && left <= 7 ? (
                  <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-extrabold text-amber-100 backdrop-blur">
                    <Timer className="h-3.5 w-3.5" />
                    {left <= 0 ? "Ends today" : `Ends in ${left}d`}
                  </div>
                ) : null}

                <div className="p-4">
                  <div className="text-lg font-extrabold text-white/95">
                    {p.title}
                  </div>
                  <div className="mt-1 text-sm text-white/75">{p.desc}</div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-white/60">
                      Eligible:{" "}
                      <span className="font-bold text-white/80">{p.bu}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-200">
                      View <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Search */}
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-xl shadow-[0_14px_30px_rgba(0,0,0,0.25)]">
          <Search className="h-5 w-5 text-white/70" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/55 outline-none"
            placeholder="ค้นหาโปรโมชัน / ดีล / สิทธิพิเศษ"
          />
          <div className="rounded-xl border border-white/15 bg-white/10 px-2 py-1 text-[11px] font-bold text-white/75">
            {activePointType}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {(
            [
              ["for-you", "For you"],
              ["all", "All"],
              ["upcoming", "Upcoming"],
              ["expiring", "Expiring"],
            ] as const
          ).map(([k, label]) => {
            const active = tab === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={`rounded-2xl  px-3 py-2 text-[12px] font-extrabold transition
                  ${
                    active
                      ? " bg-white text-blue-950"
                      : " bg-white text-blue-950 hover:bg-white/15"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* List header */}
        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm font-bold text-white/90">
            {tab === "for-you" ? "Promotions for you" : "All promotions"}
          </div>
          <div className="text-xs text-white/60">{filtered.length} items</div>
        </div>

        {/* List */}
        <div className="mt-3 space-y-3">
          {filtered.map((p) => {
            const left = daysLeft(p.endAt);
            return (
              <Link
                key={p.id}
                href={`/main/promotions/${p.id}`}
                className="block overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl
                shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
                hover:bg-white/15 active:scale-[0.995] transition"
              >
                <div className="relative w-full aspect-[16/8]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-extrabold text-white/90 backdrop-blur">
                    <TagIcon tag={p.tag} />
                    {p.tag}
                  </div>

                  <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-extrabold text-white/90 backdrop-blur">
                    {p.bu}
                    {left !== null && left <= 7 ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-400/10 px-2 py-0.5 text-[11px] font-extrabold text-amber-100">
                        <Timer className="h-3.5 w-3.5" />
                        {left <= 0 ? "Ends today" : `${left}d`}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-[15px] font-extrabold text-white/95">
                    {p.title}
                  </div>
                  <div className="mt-1 text-sm text-white/75">{p.desc}</div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-[11px] text-white/60 line-clamp-1">
                      {p.highlights?.[0] ?? ""}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-sky-200">
                      Details <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-white/15 bg-white/10 p-6 text-center text-sm text-white/70 backdrop-blur-xl">
              ไม่พบโปรโมชันที่ตรงกับเงื่อนไข
            </div>
          ) : null}
        </div>

        <style>{`button{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

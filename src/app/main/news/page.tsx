"use client";

import React from "react";
import {
  Newspaper,
  Search,
  ChevronRight,
  Flame,
  Pin,
  Clock,
  Tag,
  ArrowUpRight,
  Filter,
} from "lucide-react";

type NewsCategory = "All" | "Announcement" | "Campaign" | "System" | "Tips";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  dateISO: string; // YYYY-MM-DD
  readMins: number;
  tags: string[];
  featured?: boolean;
  pinned?: boolean;
  trendingScore?: number;
};

const NEWS: NewsItem[] = [
  {
    id: "n2",
    title: "แคมเปญสะสม Coins แลกของรางวัล เริ่มแล้ววันนี้!",
    excerpt:
      "ทำภารกิจรายวัน/รายสัปดาห์เพื่อรับ Coins เพิ่ม เติมเร็ว แลกได้ไว พร้อมของรางวัลจำนวนจำกัด",
    category: "Campaign",
    dateISO: "2026-02-10",
    readMins: 3,
    tags: ["Rewards", "Missions"],
    featured: true,
    trendingScore: 90,
  },
  {
    id: "n1",
    title: "ประกาศปรับปรุงระบบแลกคะแนน (ช่วงดึก)",
    excerpt:
      "ระบบแลกคะแนนจะมีการปรับปรุงเพื่อเพิ่มความเสถียรในช่วงเวลา 00:30–02:00 น. ผู้ใช้งานอาจพบการทำรายการช้าลงชั่วคราว",
    category: "System",
    dateISO: "2026-02-11",
    readMins: 2,
    tags: ["Maintenance", "Stability"],
    pinned: true,
    trendingScore: 60,
  },
  {
    id: "n3",
    title: "วิธีตรวจสอบ Tier และสิทธิประโยชน์ของคุณ",
    excerpt:
      "ดู Tier ของแต่ละประเภท Point Account (TISCO/TWealth/TInsure) และเข้าใจสิทธิประโยชน์แบบง่าย ๆ ในหน้า Tier",
    category: "Tips",
    dateISO: "2026-02-08",
    readMins: 4,
    tags: ["Tier", "How-to"],
    trendingScore: 55,
  },
  {
    id: "n4",
    title: "ประกาศ: เงื่อนไขการแลกรางวัลบางรายการมีการเปลี่ยนแปลง",
    excerpt:
      "เพื่อความเหมาะสมกับการให้บริการ เงื่อนไขการแลกรางวัลบางรายการจะอัปเดตตามประเภทสมาชิกและช่วงเวลาโปรโมชัน",
    category: "Announcement",
    dateISO: "2026-02-06",
    readMins: 3,
    tags: ["Policy", "Update"],
    trendingScore: 40,
  },
  {
    id: "n5",
    title: "เพิ่มหมวดข่าวสารใหม่ (News) — ติดตามข้อมูลสำคัญในที่เดียว",
    excerpt:
      "รวมประกาศ แคมเปญ และทิปการใช้งาน เพื่อให้คุณไม่พลาดข้อมูลสำคัญ พร้อมปรับ...",
    category: "Announcement",
    dateISO: "2026-02-05",
    readMins: 2,
    tags: ["News", "Product"],
    trendingScore: 35,
  },
];

function formatThaiDate(iso: string) {
  const [y, m, d] = iso.split("-").map((x) => Number(x));
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm border transition",
        active
          ? "bg-white/12 border-white/20 text-white"
          : "bg-white/5 border-white/10 text-white/75 hover:bg-white/8 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function CategoryBadge({ cat }: { cat: NewsCategory }) {
  const cls =
    cat === "Campaign"
      ? "bg-emerald-500/15 border-emerald-400/25 text-emerald-200"
      : cat === "System"
        ? "bg-amber-500/15 border-amber-400/25 text-amber-200"
        : cat === "Announcement"
          ? "bg-slate-500/15 border-slate-400/25 text-slate-200"
          : cat === "Tips"
            ? "bg-indigo-500/15 border-indigo-400/25 text-indigo-200"
            : "bg-white/8 border-white/10 text-white/80";

  return (
    <span
      className={[
        "inline-flex items-center rounded-md border px-2 py-1 text-xs",
        cls,
      ].join(" ")}
    >
      <Tag className="mr-1 h-3.5 w-3.5 opacity-90" />
      {cat}
    </span>
  );
}

export default function NewsPage() {
  const [cat, setCat] = React.useState<NewsCategory>("All");
  const [q, setQ] = React.useState("");

  const featured = React.useMemo(
    () => NEWS.find((n) => n.featured) ?? NEWS[0],
    [],
  );
  const pinned = React.useMemo(() => NEWS.filter((n) => n.pinned), []);
  const trending = React.useMemo(
    () =>
      [...NEWS]
        .sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
        .slice(0, 4),
    [],
  );

  const list = React.useMemo(() => {
    const text = q.trim().toLowerCase();
    return NEWS.filter((n) => {
      if (cat !== "All" && n.category !== cat) return false;
      if (!text) return true;
      return (
        n.title.toLowerCase().includes(text) ||
        n.excerpt.toLowerCase().includes(text)
      );
    }).sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
  }, [cat, q]);

  return (
    <div className="min-h-[100dvh] bg-[#070A10] text-white">
      {/* theme background (เหมือน tier/mission) */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_90%_20%,rgba(99,102,241,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%,rgba(255,255,255,0.03))]" />
        <div className="absolute inset-0 opacity-[0.25] [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm text-white/70">
              <Newspaper className="h-4 w-4" />
              <span>News</span>
              <ChevronRight className="h-4 w-4 opacity-60" />
              <span className="text-white/90">News & Announcment</span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">News</h1>
            <p className="mt-1 text-sm text-white/70">
              Content-first and easy to read — minimal glass effects.
            </p>
          </div>

          {/* search (ไม่ glass: ใช้พื้นทึบมากขึ้น) */}
          <div className="w-full max-w-sm">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B0F18] px-3 py-2">
              <Search className="h-4 w-4 text-white/55" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ค้นหาข่าว..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
              />
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75 hover:bg-white/8"
                onClick={() => {}}
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              "All",
              "Announcement",
              "Campaign",
              "System",
              "Tips",
            ] as NewsCategory[]
          ).map((c) => (
            <Pill key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Pill>
          ))}
        </div>

        {/* Layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Main */}
          <div className="lg:col-span-3 space-y-5">
            {/* Featured (เน้น content: พื้นทึบ + padding เยอะ อ่านง่าย) */}
            <div className="rounded-3xl border border-white/10 bg-[#0B0F18] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold">
                  <Flame className="h-4 w-4 text-orange-400" />
                  Featured
                </div>
                <div className="text-xs text-white/60">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatThaiDate(featured.dateISO)} • {featured.readMins}{" "}
                    นาที
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <CategoryBadge cat={featured.category} />
                <h2 className="mt-3 text-xl font-semibold leading-snug">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  {featured.excerpt}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
                  onClick={() => {
                    // placeholder: ไปหน้า detail
                    // router.push(`/main/news/${featured.id}`)
                  }}
                >
                  อ่านต่อ <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="rounded-3xl border border-white/10 bg-[#0B0F18]">
              <div className="border-b border-white/10 px-6 py-4">
                <div className="text-sm font-semibold">ข่าวทั้งหมด</div>
                <div className="mt-1 text-xs text-white/60">
                  แสดง {list.length} รายการ
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {list.map((n) => (
                  <div key={n.id} className="px-6 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CategoryBadge cat={n.category} />
                      <div className="text-xs text-white/60">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatThaiDate(n.dateISO)} • {n.readMins} นาที
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {n.pinned ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/75">
                              <Pin className="h-3.5 w-3.5" />
                              Pinned
                            </span>
                          ) : null}

                          <h3 className="text-base font-semibold leading-snug">
                            {n.title}
                          </h3>
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80">
                          {n.excerpt}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {n.tags.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="shrink-0 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/14"
                        onClick={() => {
                          // placeholder: ไปหน้า detail
                          // router.push(`/main/news/${n.id}`)
                        }}
                      >
                        อ่าน
                      </button>
                    </div>
                  </div>
                ))}

                {list.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-white/70">
                    ไม่พบข่าวที่ตรงกับการค้นหา
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            {/* Pinned */}
            <div className="rounded-3xl border border-white/10 bg-[#0B0F18] p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Pinned</div>
                <Pin className="h-4 w-4 text-white/65" />
              </div>

              <div className="mt-3 space-y-3">
                {pinned.length ? (
                  pinned.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left hover:bg-white/5"
                      onClick={() => {}}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">
                            {n.title}
                          </div>
                          <div className="mt-1 text-xs text-white/60">
                            {formatThaiDate(n.dateISO)}
                          </div>
                        </div>
                        <ChevronRight className="mt-0.5 h-4 w-4 text-white/35" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-white/70">ยังไม่มี pinned</div>
                )}
              </div>
            </div>

            {/* Trending */}
            <div className="rounded-3xl border border-white/10 bg-[#0B0F18] p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Trending</div>
                <span className="inline-flex items-center gap-1 text-xs text-white/60">
                  <Flame className="h-4 w-4 text-orange-400" />
                  Hot
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {trending.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left hover:bg-white/5"
                    onClick={() => {}}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {n.title}
                        </div>
                        <div className="mt-1 text-xs text-white/60">
                          {formatThaiDate(n.dateISO)} • {n.readMins} นาที
                        </div>
                      </div>
                      <ChevronRight className="mt-0.5 h-4 w-4 text-white/35" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="rounded-3xl border border-white/10 bg-[#0B0F18] p-5">
              <div className="text-sm font-semibold">Note</div>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                This page is designed for content-first reading: generous
                spacing, comfortable line height, and clear contrast—using a
                solid background that stays consistent with the main theme.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-white/50">
          © News • /main/news
        </div>
      </div>
    </div>
  );
}

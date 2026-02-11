"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Search, Ticket, Clock3, BadgeCheck } from "lucide-react";

type UserCouponStatus = "active" | "used" | "expired" | "suspended" | "saved";
type PointType = "TISCO" | "TWEALTH" | "TINSURE";

type MyCouponItem = {
  _id: string;
  rewardId: string;
  rewardTitle: string;
  rewardDesc?: string;
  rewardImage?: string;

  pointType: PointType;
  pointCost: number;

  status: UserCouponStatus;

  couponCode?: string;
  expiresAt?: string;
  redeemedAt?: string;
  usedAt?: string;
};

function fmtDate(v?: string) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusLabel(s: UserCouponStatus) {
  if (s === "active")
    return {
      text: "พร้อมใช้",
      cls: "bg-emerald-400/10 border-emerald-300/20 text-emerald-100",
    };
  if (s === "saved")
    return {
      text: "เก็บไว้",
      cls: "bg-amber-400/10 border-amber-300/20 text-amber-100",
    };
  if (s === "used")
    return {
      text: "ใช้แล้ว",
      cls: "bg-sky-400/10 border-sky-300/20 text-sky-100",
    };
  if (s === "expired")
    return {
      text: "หมดอายุ",
      cls: "bg-rose-400/10 border-rose-300/20 text-rose-100",
    };
  return { text: "ระงับ", cls: "bg-white/10 border-white/15 text-white/80" };
}

export default function MyCouponPage() {
  const [items, setItems] = useState<MyCouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<UserCouponStatus | "all">("all");
  const [q, setQ] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/mycoupon", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(
          json?.message || `Load mycoupon failed (${res.status})`,
        );
      }

      const data = Array.isArray(json?.data) ? json.data : [];
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load my coupon");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return items.filter((it) => {
      const okTab = tab === "all" ? true : it.status === tab;
      const okQ =
        kw === ""
          ? true
          : String(it.rewardTitle ?? "")
              .toLowerCase()
              .includes(kw) ||
            String(it.rewardDesc ?? "")
              .toLowerCase()
              .includes(kw) ||
            String(it.couponCode ?? "")
              .toLowerCase()
              .includes(kw);
      return okTab && okQ;
    });
  }, [items, tab, q]);

  const stats = useMemo(() => {
    const s = {
      all: items.length,
      active: 0,
      saved: 0,
      used: 0,
      expired: 0,
      suspended: 0,
    };
    for (const it of items) {
      if (it.status === "active") s.active++;
      else if (it.status === "saved") s.saved++;
      else if (it.status === "used") s.used++;
      else if (it.status === "expired") s.expired++;
      else if (it.status === "suspended") s.suspended++;
    }
    return s;
  }, [items]);

  async function openCoupon(it: MyCouponItem) {
    try {
      if (it.status === "saved") {
        const res = await fetch(
          `/api/mycoupon/${encodeURIComponent(it._id)}/activate`,
          {
            method: "POST",
            credentials: "include",
            headers: { Accept: "application/json" },
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || `Activate failed (${res.status})`);
        }

        await load();
      }

      window.location.href = `/main/mycoupon/${it._id}`;
    } catch (e: any) {
      setError(e?.message ?? "Activate failed");
    }
  }
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
        {/* top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/main/home"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90
              backdrop-blur-xl hover:bg-white/15 active:scale-[0.99] transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="text-sm font-bold text-white/90">My Coupon</div>
          <button
            type="button"
            onClick={load}
            className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/85
              hover:bg-white/15 active:scale-[0.99] transition"
          >
            Refresh
          </button>
        </div>

        {/* search */}
        <div className="mt-4 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 border border-white/10">
              <Search className="h-4 w-4 text-white/80" />
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหาคูปอง / โค้ด / ชื่อรางวัล"
              className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/35 outline-none
                focus:border-sky-300/50 focus:ring-2 focus:ring-sky-300/20 transition"
            />
          </div>

          {/* tabs */}
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {(
              [
                ["all", `ทั้งหมด (${stats.all})`],
                ["active", `พร้อมใช้ (${stats.active})`],
                ["saved", `เก็บไว้ (${stats.saved})`],
                ["used", `ใช้แล้ว (${stats.used})`],
                ["expired", `หมดอายุ (${stats.expired})`],
              ] as const
            ).map(([k, label]) => {
              const active = tab === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k as any)}
                  className={`shrink-0 rounded-2xl border px-3 py-2 text-xs font-extrabold transition
                    ${active ? "border-white/25 bg-white/20 text-white" : "border-white/10 bg-white/10 text-white/75 hover:bg-white/15"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* content */}
        <div className="mt-4">
          {loading ? (
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-sm text-white/70">
              Loading...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-50">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-xl">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-white/10 border border-white/10">
                <Ticket className="h-6 w-6 text-white/80" />
              </div>
              <div className="mt-3 text-sm font-extrabold text-white/90">
                ยังไม่มีคูปองในคลัง
              </div>
              <div className="mt-1 text-xs text-white/60">
                ไปหน้า Rewards เพื่อแลกคูปองได้เลย
              </div>

              <Link
                href="/main/rewards"
                className="mt-4 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-extrabold text-gray-900
                  hover:-translate-y-px active:scale-[0.99] transition"
              >
                ไปหน้า Rewards
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((it) => {
                const st = statusLabel(it.status);
                return (
                  <button
                    key={it._id}
                    // href={`/main/mycoupon/${it._id}`}
                    onClick={() => openCoupon(it)}
                    className="group overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl
                      shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
                      hover:bg-white/15 active:scale-[0.995] transition"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="relative h-[86px] w-[86px] overflow-hidden rounded-2xl ring-1 ring-white/15 bg-white/5">
                        <Image
                          src={it.rewardImage || "/data/reward/reward-1.png"}
                          alt={it.rewardTitle || "coupon"}
                          fill
                          sizes="86px"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-extrabold text-white/95">
                              {it.rewardTitle}
                            </div>
                            <div className="mt-0.5 line-clamp-1 text-xs text-white/65">
                              {it.rewardDesc || "Coupon"}
                            </div>
                          </div>

                          <div
                            className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-extrabold ${st.cls}`}
                          >
                            {st.text}
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[11px] font-bold text-white/85">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            ใช้แต้ม {it.pointType} -{it.pointCost}
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[11px] font-bold text-white/70">
                            <Clock3 className="h-3.5 w-3.5" />
                            หมดอายุ {fmtDate(it.expiresAt)}
                          </span>

                          {it.couponCode ? (
                            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[11px] font-bold text-white/70">
                              CODE:{" "}
                              <span className="ml-1 text-white/90">
                                {it.couponCode}
                              </span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <style>{`button{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

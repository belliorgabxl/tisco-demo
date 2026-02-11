"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Gift,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { formatNumber } from "@/libs/utils/format";

type HistoryItem = {
  id: string;
  type: string;
  status: string;
  description: string;
  transactionRef: string;
  couponId: string | null;
  tierId: string | null;
  pointChange: {
    tiscoPoint: number;
    twealthPoint: number;
    tinsurePoint: number;
  };
  balanceAfter: {
    tiscoPoint: number;
    twealthPoint: number;
    tinsurePoint: number;
  };
  createdAt: string;
};

type ApiResp = {
  success: boolean;
  data: HistoryItem[];
  paging?: { nextCursor: string | null };
  message?: string;
};

function sumChange(p: HistoryItem["pointChange"]) {
  const t = Number(p.tiscoPoint ?? 0);
  const w = Number(p.twealthPoint ?? 0);
  const i = Number(p.tinsurePoint ?? 0);
  return { t, w, i, total: t + w + i };
}

function statusBadge(status: string) {
  const s = String(status || "").toLowerCase();
  if (s === "success")
    return "border-emerald-300/20 bg-emerald-400/10 text-emerald-50";
  if (s === "failed") return "border-rose-300/20 bg-rose-400/10 text-rose-50";
  if (s === "pending")
    return "border-amber-300/20 bg-amber-400/10 text-amber-50";
  return "border-white/15 bg-white/10 text-white/80";
}

function typeIcon(type: string) {
  const t = String(type || "").toLowerCase();
  if (t.includes("earn"))
    return <ArrowDownLeft className="h-4 w-4 text-emerald-200" />;
  if (t.includes("spend") || t.includes("redeem"))
    return <ArrowUpRight className="h-4 w-4 text-rose-200" />;
  if (t.includes("coupon")) return <Gift className="h-4 w-4 text-sky-200" />;
  if (t.includes("tier"))
    return <Sparkles className="h-4 w-4 text-yellow-200" />;
  return <Clock className="h-4 w-4 text-white/70" />;
}

function prettyType(type: string) {
  const t = String(type || "");
  return t
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<string>(""); // "" = all
  const [statusFilter, setStatusFilter] = useState<string>(""); // "" = all

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("limit", "15");
    if (typeFilter) sp.set("type", typeFilter);
    if (statusFilter) sp.set("status", statusFilter);
    return sp.toString();
  }, [typeFilter, statusFilter]);

  async function fetchFirst() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/history?${query}`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const json = (await res.json().catch(() => null)) as ApiResp | null;

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || `Failed (${res.status})`);
      }

      setItems(json.data ?? []);
      setNextCursor(json.paging?.nextCursor ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load history");
      setItems([]);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMore() {
    if (!nextCursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const res = await fetch(
        `/api/history?${query}&cursor=${encodeURIComponent(nextCursor)}`,
        {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        },
      );

      const json = (await res.json().catch(() => null)) as ApiResp | null;

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || `Failed (${res.status})`);
      }

      setItems((prev) => [...prev, ...(json.data ?? [])]);
      setNextCursor(json.paging?.nextCursor ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center px-4 py-4 text-sky-50">
      {/* background */}
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
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="text-[18px] font-extrabold tracking-tight text-white/95">
            History
          </div>
          <div className="inline-flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Image
                src="/logo/tisco-logo.png"
                alt="logo"
                fill
                className="object-contain p-1.5"
              />
            </div>
          </div>
        </div>

        {/* filters */}
        <div
          className="mt-4 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl
          shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <div className="grid grid-cols-2 gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white
                outline-none focus:border-sky-300/40 focus:ring-2 focus:ring-sky-300/15"
            >
              <option value="" className="text-black">
                All Types
              </option>
              <option value="point_earn" className="text-black">
                Point Earn
              </option>
              <option value="point_spend" className="text-black">
                Point Spend
              </option>
              <option value="coupon_redeem" className="text-black">
                Coupon Redeem
              </option>
              <option value="coupon_use" className="text-black">
                Coupon Use
              </option>
              <option value="point_transfer" className="text-black">
                Point Transfer
              </option>
              <option value="tier_upgrade" className="text-black">
                Tier Upgrade
              </option>
              <option value="tier_downgrade" className="text-black">
                Tier Downgrade
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white
                outline-none focus:border-sky-300/40 focus:ring-2 focus:ring-sky-300/15"
            >
              <option value="" className="text-black">
                All Status
              </option>
              <option value="success" className="text-black">
                Success
              </option>
              <option value="pending" className="text-black">
                Pending
              </option>
              <option value="failed" className="text-black">
                Failed
              </option>
              <option value="cancelled" className="text-black">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        {/* states */}
        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl"
              >
                <div className="h-4 w-44 bg-white/10 rounded animate-pulse" />
                <div className="mt-3 h-3 w-64 bg-white/10 rounded animate-pulse" />
                <div className="mt-3 h-3 w-32 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-4 rounded-3xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-50">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-white/15 bg-white/10 p-6 text-center text-sm text-white/70 backdrop-blur-xl">
            ยังไม่มีประวัติรายการ
          </div>
        ) : (
          <>
            {/* list */}
            <div className="mt-4 grid gap-3">
              {items.map((h) => {
                const change = sumChange(h.pointChange);
                const total = change.total;
                const isPlus = total > 0;

                return (
                  <div
                    key={h.id}
                    className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl
                      shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                        {typeIcon(h.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate text-sm font-extrabold text-white/95">
                            {prettyType(h.type)}
                          </div>
                          <div
                            className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusBadge(h.status)}`}
                          >
                            {String(h.status).toUpperCase()}
                          </div>
                        </div>

                        <div className="mt-1 text-xs text-white/65">
                          {h.description || "-"}
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="text-[11px] text-white/55">
                            {fmtTime(h.createdAt)}
                            {h.transactionRef ? (
                              <span className="ml-2 text-white/40">
                                • ref: {h.transactionRef}
                              </span>
                            ) : null}
                          </div>

                          <div
                            className={`text-sm font-extrabold ${isPlus ? "text-emerald-100" : total < 0 ? "text-rose-100" : "text-white/80"}`}
                          >
                            {total > 0 ? "+" : ""}
                            {formatNumber(total)}
                          </div>
                        </div>

                        {/* per-type mini */}
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                            <div className="text-[10px] text-white/55">
                              TISCO
                            </div>
                            <div className="text-xs font-bold text-white/90">
                              {change.t > 0 ? "+" : ""}
                              {formatNumber(change.t)}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                            <div className="text-[10px] text-white/55">
                              TINSURE
                            </div>
                            <div className="text-xs font-bold text-white/90">
                              {change.i > 0 ? "+" : ""}
                              {formatNumber(change.i)}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                            <div className="text-[10px] text-white/55">
                              TWEALTH
                            </div>
                            <div className="text-xs font-bold text-white/90">
                              {change.w > 0 ? "+" : ""}
                              {formatNumber(change.w)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-1 text-white/40">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* load more */}
            <div className="mt-4">
              {nextCursor ? (
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={fetchMore}
                  className="w-full h-12 rounded-2xl border border-white/15 bg-white/10 font-extrabold text-white/90
                    hover:bg-white/15 active:scale-[0.99] transition disabled:opacity-70"
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              ) : (
                <div className="text-center text-[11px] text-white/45">
                  End of history
                </div>
              )}
            </div>
          </>
        )}

        <style>{`button{-webkit-tap-highlight-color:transparent;} select{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

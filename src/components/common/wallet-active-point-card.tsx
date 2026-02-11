"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { PointType } from "@/resource/constant";
import { formatNumber, mapMeToBalances } from "@/libs/utils/format";
import {
  ActivePointCardProps,
  Balances,
  DEFAULT_BALANCES,
} from "@/resource/type";

const POINT_META: Record<
  PointType,
  { title: string; sub: string; logo: string }
> = {
  TISCO: {
    title: "Tisco Point",
    sub: "แต้มสะสม",
    logo: "/logo/tisco-logo.png",
  },
  TINSURE: {
    title: "TInsure",
    sub: "แต้มประกัน",
    logo: "/logo/tisco-logo.png",
  },
  TWEALTH: { title: "TWealth", sub: "แต้มลงทุน", logo: "/logo/tisco-logo.png" },
};

function isPointType(v: any): v is PointType {
  return v === "TISCO" || v === "TINSURE" || v === "TWEALTH";
}

export default function WalletActivePointCard({
  meEndpoint = "/api/auth/me",
  storageKey = "activePointType",
  onChangeType,
  onAmountChange,
}: ActivePointCardProps & {
  onAmountChange?: (payload: {
    type: PointType;
    amount: number;
    balances: Balances;
  }) => void;
}) {
  const [activeType, setActiveType] = useState<PointType>("TISCO");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<Balances>(DEFAULT_BALANCES);

  useEffect(() => {
    try {
      const v = sessionStorage.getItem(storageKey);
      if (isPointType(v)) setActiveType(v);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(meEndpoint, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`auth/me failed (${res.status})`);

        const json = await res.json();
        const mapped = mapMeToBalances(json);

        if (alive) setBalances(mapped);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load wallet");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [meEndpoint]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== storageKey) return;
      if (isPointType(e.newValue)) setActiveType(e.newValue);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const meta = useMemo(() => POINT_META[activeType], [activeType]);
  const amount = balances[activeType] ?? 0;

  useEffect(() => {
    if (loading || error) return;
    onAmountChange?.({ type: activeType, amount, balances });
  }, [activeType, amount, balances, loading, error, onAmountChange]);

  function setType(next: PointType) {
    setActiveType(next);
    try {
      sessionStorage.setItem(storageKey, next);
    } catch {}
    onChangeType?.(next);
    window.dispatchEvent(
      new StorageEvent("storage", { key: storageKey, newValue: next }),
    );
  }

  if (loading) {
    return (
      <div
        className="mt-4 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl
        shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white/10 animate-pulse" />
          <div className="flex-1">
            <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
            <div className="mt-2 h-3 w-36 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="h-7 w-20 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-50">
        {error}
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl
        shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      {/* Active only */}
      <button
        type="button"
        onClick={() => setType(activeType)}
        className="w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-full flex justify-center items-center bg-white ring-1 ring-white/15">
            <Image
              src={meta.logo}
              alt={meta.title}
              fill
              className="object-contain h-10 w-10"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-extrabold text-white/90">
              {meta.title}
            </div>
            <div className="mt-0.5 truncate text-sm  text-white/60">
              {meta.sub}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-extrabold text-white/95">
              {formatNumber(amount)}
            </div>
            <div className="mt-0.5 text-sm text-white/55">{activeType}</div>
          </div>
        </div>
      </button>
    </div>
  );
}

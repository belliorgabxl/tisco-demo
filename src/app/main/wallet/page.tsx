"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  Clock,
  History,
  Minus,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet as WalletIcon,
} from "lucide-react";
import { ACTIVE_POINT_TYPE_KEY, PointType } from "@/resource/constant";
import { formatNumber } from "@/libs/utils/format";
import WalletActivePointCard from "@/components/common/wallet-active-point-card";
import ThemeBackground from "@/components/theme-background";

type WalletTxn = {
  id: string;
  type: "EARN" | "BURN" | "ADJUST";
  pointType: PointType;
  title: string;
  subtitle: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  at: string;
};

const POINT_TYPES: Array<{
  type: PointType;
  title: string;
  sub: string;
  logo: string;
}> = [
  {
    type: "TISCO",
    title: "Tisco Point",
    sub: "แต้มสะสม",
    logo: "/logo/tisco-logo.png",
  },
  {
    type: "TINSURE",
    title: "TInsure",
    sub: "แต้มประกัน",
    logo: "/logo/tisco-logo.png",
  },
  {
    type: "TWEALTH",
    title: "TWealth",
    sub: "แต้มลงทุน",
    logo: "/logo/tisco-logo.png",
  },
];

export default function WalletPage() {
  const [activeType, setActiveType] = useState<PointType>("TISCO");
  const [q, setQ] = useState("");
  const [activeAmount, setActiveAmount] = useState(0);
  const balances = useMemo(() => {
    return {
      TISCO: 12500,
      TINSURE: 3200,
      TWEALTH: 780,
    } satisfies Record<PointType, number>;
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(ACTIVE_POINT_TYPE_KEY);
      const t = String(saved ?? "").toUpperCase();

      if (t === "TISCO" || t === "TINSURE" || t === "TWEALTH") {
        setActiveType(t as PointType);
      } else {
        setActiveType("TISCO");
        sessionStorage.setItem(ACTIVE_POINT_TYPE_KEY, "TISCO");
      }
    } catch {
      setActiveType("TISCO");
    }
  }, []);

  const txns: WalletTxn[] = useMemo(
    () => [
      {
        id: "tx_001",
        type: "EARN",
        pointType: "TISCO",
        title: "Earn points",
        subtitle: "ซื้อสินค้าที่ร่วมรายการ",
        amount: 250,
        status: "SUCCESS",
        at: "Today · 18:40",
      },
      {
        id: "tx_002",
        type: "BURN",
        pointType: "TISCO",
        title: "Redeem reward",
        subtitle: "Free Coupon (Demo)",
        amount: -10,
        status: "SUCCESS",
        at: "Today · 12:10",
      },
      {
        id: "tx_003",
        type: "EARN",
        pointType: "TINSURE",
        title: "Insurance bonus",
        subtitle: "แคมเปญ TInsure",
        amount: 120,
        status: "PENDING",
        at: "Yesterday · 20:05",
      },
      {
        id: "tx_004",
        type: "ADJUST",
        pointType: "TWEALTH",
        title: "Adjustment",
        subtitle: "ปรับยอดโดยระบบ",
        amount: 30,
        status: "SUCCESS",
        at: "Feb 8 · 09:22",
      },
      {
        id: "tx_005",
        type: "BURN",
        pointType: "TINSURE",
        title: "Use points",
        subtitle: "แลกส่วนลดประกัน",
        amount: -50,
        status: "FAILED",
        at: "Feb 7 · 16:10",
      },
    ],
    [],
  );

  const filteredTxns = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return txns
      .filter((t) => t.pointType === activeType)
      .filter((t) => {
        if (!needle) return true;
        return (
          t.title.toLowerCase().includes(needle) ||
          t.subtitle.toLowerCase().includes(needle) ||
          t.status.toLowerCase().includes(needle)
        );
      });
  }, [txns, activeType, q]);

  const activeMeta =
    POINT_TYPES.find((x) => x.type === activeType) ?? POINT_TYPES[0];
  const activeBalance = balances[activeType] ?? 0;

  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center px-4 py-4 text-sky-50">
      {/* Background */}
      <ThemeBackground type={activeType} />

      <section className="w-full max-w-[520px] relative pb-28">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="w-20"></div>
          <div className="inline-flex items-center gap-2 text-sm font-bold text-white/90">
            <WalletIcon className="h-6 w-6 text-sky-200" />
            Wallet
          </div>

          <button
            type="button"
            onClick={() => {
              console.log("refresh wallet");
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90
              backdrop-blur-xl hover:bg-white/15 active:scale-[0.99] transition"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div
          className="mt-4 rounded-xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl
          shadow-[0_14px_30px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          {/* Breakdown */}
          <WalletActivePointCard
            onAmountChange={({ type, amount }) => {
              console.log("active type:", type, "amount:", amount);
              setActiveAmount(amount);
            }}
            meEndpoint="/api/auth/me"
            storageKey="activePointType"
          />
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => console.log("topup")}
            className="group rounded-3xl border border-white/15 bg-white/10 px-4 py-4 text-left backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
              hover:bg-white/15 active:scale-[0.995] flex justify-start gap-2 items-start transition"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Plus className="h-5 w-5 text-sky-200" />
            </div>
            <div className="">
              <p className=" text-sm font-extrabold text-white/90">Top up</p>
              <p className="mt-1 text-xs text-white/60">เติมเครดิต</p>
            </div>
          </button>

          <Link
            href={"/main/transfer-point"}
            type="button"
            onClick={() => console.log("transfer")}
            className="group rounded-3xl border border-blue-300/80 bg-white/10 px-2 py-4 text-left backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
              hover:bg-white/15 active:scale-[0.995] transition flex gap-2  justify-start items-start"
          >
            {/* <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <ArrowUpRight className="h-5 w-5 text-sky-200" />
            </div> */}

            <div className="w-full grid place-items-center">
              <p className=" text-sm font-extrabold text-white/90">
                Transfer-Point
              </p>
              <p className="mt-1 text-xs text-white/60">
                โอนแต้ม / ส่งต่อสิทธิ์
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => console.log("redeem")}
            className="group rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
              hover:bg-white/15 active:scale-[0.995] transition flex justify-start gap-2  items-start"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Sparkles className="h-5 w-5 text-sky-200" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white/90">Redeem</p>
              <p className="mt-1 text-xs text-white/60">แลกของรางวัล</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => console.log("history")}
            className="group rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
              hover:bg-white/15 active:scale-[0.995] transition flex justify-start gap-2  items-start"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <History className="h-5 w-5 text-sky-200" />
            </div>
            <div>
              <div className=" text-sm font-extrabold text-white/90">
                History
              </div>
              <div className="mt-1 text-xs text-white/60">ดูรายการทั้งหมด</div>
            </div>
          </button>
        </div>

        {/* Search + Active account mini summary */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm font-bold text-white/90">
            Recent activity ·{" "}
            <span className="text-white/70">{activeMeta.title}</span>
          </div>
          <div className="text-xs font-semibold text-white/70">
            Balance:{" "}
            <span className="text-sm text-white/90">
              {formatNumber(activeAmount)}
            </span>
          </div>
        </div>

        <div
          className="mt-3 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-xl
          shadow-[0_14px_30px_rgba(0,0,0,0.20)]"
        >
          <Search className="h-5 w-5 text-white/65" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/45 outline-none"
            placeholder="ค้นหารายการ: earn / redeem / pending..."
          />
          <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/75">
            {filteredTxns.length}
          </span>
        </div>

        {/* Txn list */}
        <div className="mt-3 space-y-3">
          {filteredTxns.map((t) => {
            const isPlus = t.amount > 0;
            const pill =
              t.status === "SUCCESS"
                ? "bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-300/20"
                : t.status === "PENDING"
                  ? "bg-amber-300/15 text-amber-100 ring-1 ring-amber-300/20"
                  : "bg-rose-300/15 text-rose-100 ring-1 ring-rose-300/20";

            const Icon =
              t.type === "EARN"
                ? ArrowDownLeft
                : t.type === "BURN"
                  ? ArrowUpRight
                  : Minus;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => console.log("open txn", t.id)}
                className="w-full rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl
                  shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
                  hover:bg-white/15 active:scale-[0.995] transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                      <Icon className="h-5 w-5 text-sky-200" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-extrabold text-white/90">
                          {t.title}
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${pill}`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <div className="mt-1 line-clamp-1 text-xs text-white/60">
                        {t.subtitle}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 text-[11px] text-white/55">
                        <Clock className="h-3.5 w-3.5" />
                        {t.at}
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                        {t.pointType}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-extrabold ${
                        isPlus ? "text-emerald-100" : "text-white/90"
                      }`}
                    >
                      {isPlus ? "+" : ""}
                      {formatNumber(t.amount)}
                    </div>
                    <div className="mt-1 text-[11px] text-white/55">Points</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end text-white/65">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Tips */}
        <div
          className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl
          shadow-[0_14px_30px_rgba(0,0,0,0.20),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <ShieldCheck className="h-5 w-5 text-sky-200" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white/90">Tips</div>
              <div className="mt-1 text-xs leading-relaxed text-white/60">
                • แต้มบางประเภทอาจมีวันหมดอายุ
                <br />
                • รายการ Pending อาจใช้เวลาอัปเดตตามระบบคู่ค้า
                <br />• ถ้ามีปัญหา ให้ติดต่อ Support พร้อม Transaction ID
              </div>
            </div>
          </div>
        </div>

        {/* remove tap highlight */}
        <style>{`button{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

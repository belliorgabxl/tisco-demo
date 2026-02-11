"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Repeat2,
  Sparkles,
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";
import SuccessTransferModal from "./transfer-success-popup";

type PointType = "TISCO" | "TWEALTH" | "TINSURE";

type CreditSummary = {
  tiscoPoint: number;
  twealthPoint: number;
  tinsurePoint: number;
  totalPoints: number;
};

function normalizePointType(v: string | null): PointType | null {
  if (!v) return null;
  const s = String(v).trim().toUpperCase();

  if (s === "TISCO" || s === "TISCO_POINT" || s === "POINT_TISCO")
    return "TISCO";
  if (s === "TWEALTH" || s === "TWEALTH_POINT") return "TWEALTH";
  if (s === "TINSURE" || s === "TINSURE_POINT") return "TINSURE";

  return null;
}

function labelOf(t: PointType) {
  if (t === "TISCO") return "TISCO Point";
  if (t === "TWEALTH") return "TWealth Point";
  return "TInsure Point";
}

function getBalanceByType(type: PointType, credit: CreditSummary) {
  if (type === "TISCO") return Number(credit.tiscoPoint ?? 0);
  if (type === "TWEALTH") return Number(credit.twealthPoint ?? 0);
  return Number(credit.tinsurePoint ?? 0);
}

export default function TransferPointClient({ toParam }: { toParam: string }) {
  const router = useRouter();
  const [successOpen, setSuccessOpen] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    from: PointType;
    to: PointType;
    amount: number;
  } | null>(null);
  const [fromType, setFromType] = useState<PointType | null>(null);
  const [toType, setToType] = useState<PointType | null>(null);

  const [credit, setCredit] = useState<CreditSummary | null>(null);
  const [amountText, setAmountText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // init from/to
  useEffect(() => {
    const raw = sessionStorage.getItem("activePointType");
    const from = normalizePointType(raw);
    const to = normalizePointType(toParam);

    setFromType(from);
    setToType(to);
  }, [toParam]);

  // fetch credit
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch("/api/credits", { method: "GET" });
        const json = await res.json();

        if (!res.ok || !json?.success) {
          setErrorMsg(json?.message || "Failed to load balance");
          return;
        }

        setCredit(json.data as CreditSummary);
      } catch (e: any) {
        setErrorMsg(e?.message || "Failed to load balance");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fromBalance = useMemo(() => {
    if (!credit || !fromType) return null;
    return getBalanceByType(fromType, credit);
  }, [credit, fromType]);

  const toBalance = useMemo(() => {
    if (!credit || !toType) return null;
    return getBalanceByType(toType, credit);
  }, [credit, toType]);

  const amount = useMemo(() => {
    const n = Number(String(amountText).replace(/,/g, ""));
    if (!Number.isFinite(n)) return 0;
    return Math.floor(n);
  }, [amountText]);

  const validation = useMemo(() => {
    if (!fromType) return "ไม่พบแต้มต้นทาง (activePointType)";
    if (!toType) return "ไม่พบแต้มปลายทางจาก route";
    if (fromType === toType) return "ปลายทางต้องไม่ใช่ประเภทแต้มเดียวกับต้นทาง";
    if (loading) return "";
    if (fromBalance === null) return "กำลังโหลดแต้ม";
    if (amount <= 0) return "กรุณาใส่จำนวนแต้มที่ต้องการโอน";
    if (amount > fromBalance) return "จำนวนแต้มเกินยอดที่มี";
    return "";
  }, [fromType, toType, loading, fromBalance, amount]);

  const canSubmit = !loading && !submitting && !validation;

  const quick = (v: number) => {
    setAmountText(String(v));
  };

  const setMax = () => {
    if (typeof fromBalance === "number") setAmountText(String(fromBalance));
  };

  const onSubmit = async () => {
    if (!canSubmit || !fromType || !toType) return;

    try {
      setSubmitting(true);
      setErrorMsg("");

      const res = await fetch("/api/transfer-point", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fromPointType: fromType,
          toPointType: toType,
          amount,
          description: `Transfer ${fromType} -> ${toType}`,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.success) {
        setErrorMsg(json?.message || "Transfer failed");
        return;
      }

      setCredit(json.data as CreditSummary);

      setAmountText("");

      setSuccessInfo({ from: fromType, to: toType, amount });
      setSuccessOpen(true);
      setErrorMsg("");
    } catch (e: any) {
      setErrorMsg(e?.message || "Transfer failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center px-4 py-6 text-sky-50">
      {/* BG */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10
        bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(88,197,255,0.28),transparent_55%),radial-gradient(900px_500px_at_90%_25%,rgba(45,110,255,0.22),transparent_58%),linear-gradient(180deg,#07162F_0%,#061225_55%,#040A14_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-45
        [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)]
        [background-size:28px_28px]
        [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_70%)]"
      />

      <div className="w-full max-w-[560px]">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/main/transfer-point"
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-sm hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-sky-100/90">
            <Sparkles className="h-4 w-4" />
            Transfer Points
          </div>
        </div>

        {/* Header */}
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Exchange <span className="text-sky-200">Points</span>
        </h1>
        <p className="mt-1 text-sm text-sky-100/70">
          Transfer from your current point type to the selected destination.
        </p>

        {/* From -> To pills */}
        <div className="mt-4 rounded-2xl border border-white/12 bg-white/10 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-sky-100/60">From</div>
              <div className="mt-1 inline-flex items-center gap-2 rounded-xl border border-white/12 bg-slate-900/70 px-3 py-2">
                <BadgeCheck className="h-4 w-4 text-sky-200" />
                <span className="font-semibold">
                  {fromType ? labelOf(fromType) : "—"}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/12 bg-white/8 p-2">
              <Repeat2 className="h-4 w-4 text-sky-200" />
            </div>

            <div className="min-w-0 text-right">
              <div className="text-xs text-sky-100/60">To</div>
              <div className="mt-1 inline-flex items-center gap-2 rounded-xl border border-sky-200/20 bg-[linear-gradient(90deg,rgba(56,189,248,0.18),rgba(59,130,246,0.14))] px-3 py-2">
                <span className="font-semibold">
                  {toType ? labelOf(toType) : "—"}
                </span>
                <ArrowRight className="h-4 w-4 opacity-80" />
              </div>
            </div>
          </div>

          {/* Balances */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/12 bg-slate-900/70 p-4">
              <div className="text-xs text-sky-100/60">Available (From)</div>
              <div className="mt-1 text-xl font-bold tabular-nums">
                {typeof fromBalance === "number"
                  ? fromBalance.toLocaleString()
                  : "—"}
                <span className="ml-2 text-xs font-medium text-sky-100/60">
                  point
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/6 p-4">
              <div className="text-xs text-sky-100/60">Current (To)</div>
              <div className="mt-1 text-xl font-bold tabular-nums">
                {typeof toBalance === "number"
                  ? toBalance.toLocaleString()
                  : "—"}
                <span className="ml-2 text-xs font-medium text-sky-100/60">
                  point
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount input */}
        <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Amount</div>
              <div className="text-xs text-sky-100/60">
                Enter points to transfer
              </div>
            </div>

            <button
              type="button"
              onClick={setMax}
              className="rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-xs font-semibold hover:bg-white/10"
            >
              MAX
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <input
              inputMode="numeric"
              value={amountText}
              onChange={(e) =>
                setAmountText(e.target.value.replace(/[^\d]/g, ""))
              }
              placeholder="0"
              className="w-full rounded-2xl border border-white/12 bg-slate-900/80 px-4 py-3 text-lg font-semibold outline-none focus:border-sky-200/30"
            />
            <div className="rounded-2xl border border-sky-200/20 bg-sky-500/15 px-3 py-3 text-sm font-semibold">
              Point
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {[100, 300, 500, 1000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => quick(v)}
                className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold hover:bg-white/10"
              >
                {v.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Error / hint */}
          {(errorMsg || validation) && (
            <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-300/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-50">
              <AlertTriangle className="mt-0.5 h-4 w-4 opacity-90" />
              <div className="leading-snug">
                {errorMsg ? errorMsg : validation}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className={[
              "mt-4 w-full rounded-2xl px-4 py-3 font-semibold transition",
              canSubmit
                ? "bg-[linear-gradient(90deg,rgba(56,189,248,0.95),rgba(59,130,246,0.85))] text-white hover:opacity-95"
                : "bg-white/15 text-sky-100/60 cursor-not-allowed",
            ].join(" ")}
          >
            {submitting ? "Transferring..." : "Confirm Transfer"}
          </button>
        </div>
      </div>
      <SuccessTransferModal
        open={successOpen}
        info={successInfo}
        labelOf={labelOf}
        onClose={() => setSuccessOpen(false)}
        onBackToList={() => {
          setSuccessOpen(false);
          router.push("/main/transfer-point");
        }}
        onTransferAgain={() => setSuccessOpen(false)}
      />
    </main>
  );
}

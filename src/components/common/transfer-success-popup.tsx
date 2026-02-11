"use client";

import React, { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

type PointType = "TISCO" | "TWEALTH" | "TINSURE" | "JPOINT";

export type TransferSuccessInfo = {
  from: PointType;
  to: PointType;
  amount: number;
};

type Props = {
  open: boolean;
  info: TransferSuccessInfo | null;
  labelOf: (t: PointType) => string;

  onClose: () => void;
  onBackToList?: () => void;
  onTransferAgain?: () => void;

  closeOnBackdrop?: boolean; // default true
  closeOnEsc?: boolean; // default true
};

export default function SuccessTransferModal({
  open,
  info,
  labelOf,
  onClose,
  onBackToList,
  onTransferAgain,
  closeOnBackdrop = true,
  closeOnEsc = true,
}: Props) {
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, onClose]);

  if (!open || !info) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={() => {
        if (closeOnBackdrop) onClose();
      }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* card */}
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/12 bg-slate-950/80 p-5 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-70 blur-2xl
          bg-[radial-gradient(600px_260px_at_30%_10%,rgba(56,189,248,0.22),transparent_60%)]"
        />

        <div className="relative">
          <div className="flex items-start justify-center gap-3">
            <div className="flex text-center items-center gap-3">
              <div>
                <div className="text-lg font-semibold">Transfer successful</div>
                <div className="text-sm text-sky-100/65">
                  Your points have been transferred.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/12 bg-white/6 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-sky-100/70">From</span>
              <span className="font-semibold">{labelOf(info.from)}</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-sky-100/70">To</span>
              <span className="font-semibold">{labelOf(info.to)}</span>
            </div>

            <div className="mt-3 h-px w-full bg-white/10" />

            <div className="mt-3 flex items-end justify-between">
              <div className="text-sm text-sky-100/70">Amount</div>
              <div className="text-xl font-bold tabular-nums">
                {info.amount.toLocaleString()}
                <span className="ml-2 text-xs font-medium text-sky-100/60">
                  pts
                </span>
              </div>
            </div>
          </div>
          <div className="py-4 w-full flex justify-center ">
            <CheckCircle2 className="h-14 w-14 text-green-400" />
          </div>
          <div className="mt-4 flex justify-center w-full gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-4 py-3 w-full text-sm font-semibold text-white-950
                bg-[linear-gradient(90deg,rgba(56,189,248,0.95),rgba(59,130,246,0.85))] hover:opacity-95"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

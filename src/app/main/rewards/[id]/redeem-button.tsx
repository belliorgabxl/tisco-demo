"use client";

import { useEffect, useState } from "react";
import { ChevronRight, X, Sparkles, ShieldCheck } from "lucide-react";
import Image from "next/image";

type Props = {
  rewardId: string;
  rewardTitle?: string;
  couponURL: string;
  onUseNow?: () => void;
  onUseLater?: () => void;
};

export default function RedeemConfirm({
  rewardId,
  rewardTitle = "Reward",
  couponURL,
  onUseNow,
  onUseLater,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"now" | "later" | null>(null);

  function close() {
    setOpen(false);
    setLoading(null);
  }

  async function confirm(mode: "now" | "later") {
    setLoading(mode);
    try {
      if (mode === "now") onUseNow?.();
      if (mode === "later") onUseLater?.();
      close();
    } finally {
      setLoading(null);
    }
  }

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold
          bg-white text-gray-900
          shadow-[0_18px_38px_rgba(45,110,255,0.18),0_8px_18px_rgba(88,197,255,0.10)]
          hover:-translate-y-px active:scale-[0.99] transition"
      >
        Redeem now
        <ChevronRight className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999]">
          {/* premium backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
          />

          {/* subtle glow layers */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 blur-2xl opacity-50
              bg-[radial-gradient(circle_at_30%_30%,rgba(88,197,255,0.35),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(255,120,180,0.18),transparent_60%)]"
          />

          {/* modal */}
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[430px] -translate-x-1/2 -translate-y-1/2">
            <div
              className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#07162F]/85 p-4
                shadow-[0_30px_90px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.10)]
                backdrop-blur-2xl
                animate-[pop_160ms_ease-out]"
            >
              {/* top sheen */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60
                  bg-[radial-gradient(1200px_240px_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]"
              />

              {/* header */}
              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-wide text-white/80">
                    <span className="inline-flex h-6 items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2">
                      <Sparkles className="h-3.5 w-3.5 text-sky-200" />
                      Premium Redeem
                    </span>
                    <span className="inline-flex h-6 items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 text-emerald-100">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Secure
                    </span>
                  </div>

                  <div className="mt-2 truncate text-[15px] font-extrabold text-white/95">
                    {rewardTitle}
                  </div>
                  <div className="mt-0.5 text-xs text-white/60">
                    Confirm to redeem this coupon now or save for later
                  </div>
                </div>

                <button
                  type="button"
                  onClick={close}
                  className="rounded-2xl border border-white/10 bg-white/10 p-2 text-white/80 hover:bg-white/15 active:scale-[0.98] transition"
                  aria-label="Close popup"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* preview */}
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/12 bg-white/5">
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" /> */}
                <div className="p-3">
                  <div className="flex justify-center">
                    <div className="relative h-[220px] w-[220px] overflow-hidden rounded-2xl ring-1 ring-white/15 bg-white/5">
                      <Image
                        src={couponURL}
                        alt="coupon"
                        fill
                        sizes="220px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <div className=" font-bold text-white">
                      Confirm to redeem coupon
                    </div>
                    <div className="mt-0.5 text-[11px] text-white/55">
                      rewardId: <span className="text-white/75">{rewardId}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* actions */}
              <div className="relative mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={!!loading}
                  onClick={() => confirm("now")}
                  className="h-11 rounded-2xl font-extrabold text-sm text-gray-900
                    bg-gradient-to-br from-white to-white/90
                    shadow-[0_16px_34px_rgba(88,197,255,0.18)]
                    hover:-translate-y-px active:scale-[0.99] transition
                    disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading === "now" ? "Processing..." : "Use Now"}
                </button>

                <button
                  type="button"
                  disabled={!!loading}
                  onClick={() => confirm("later")}
                  className="h-11 rounded-2xl border border-white/15 bg-white/10 font-extrabold text-sm text-white/90
                    hover:bg-white/15 active:scale-[0.99] transition
                    disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading === "later" ? "Saving..." : "Use Later"}
                </button>
              </div>

              <div className="relative mt-3 text-center text-[11px] text-white/50">
                * คุณสามารถดูคูปองทั้งหมดได้ในหน้า My Rewards
              </div>

              {/* keyframes (no extra file) */}
              <style>{`
                @keyframes pop {
                  from { transform: translateY(10px) scale(.985); opacity: .0; }
                  to { transform: translateY(0) scale(1); opacity: 1; }
                }
              `}</style>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

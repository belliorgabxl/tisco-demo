// src/app/main/mycoupon/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import QRCode from "qrcode";
import { ChevronLeft, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

type UserCouponDetail = {
  _id: string;
  rewardId: string;
  rewardTitle: string;
  rewardDesc?: string;
  rewardImage?: string;

  pointType: "TISCO" | "TWEALTH" | "TINSURE";
  pointCost: number;

  status: "redeemed" | "active" | "used" | "expired" | "suspended";
  couponCode?: string;
  qrText?: string;

  expiresAt: string;
  redeemedAt: string;
  usedAt?: string | null;
};

type ApiResp = {
  success: boolean;
  data?: UserCouponDetail;
  message?: string;
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

export default function MyCouponDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [item, setItem] = useState<UserCouponDetail | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  async function load() {
    try {
      setLoading(true);
      setErr(null);

      const res = await fetch(`/api/mycoupon/${encodeURIComponent(id)}`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const json = (await res.json().catch(() => null)) as ApiResp | null;
      if (!res.ok || !json?.success || !json.data) {
        throw new Error(json?.message || `Load failed (${res.status})`);
      }

      setItem(json.data);

      const text = json.data.qrText || json.data.couponCode || "";
      if (text) {
        const url = await QRCode.toDataURL(text, { margin: 1, scale: 8 });
        setQrDataUrl(url);
      } else {
        setQrDataUrl("");
      }
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load coupon");
      setItem(null);
      setQrDataUrl("");
    } finally {
      setLoading(false);
    }
  }

  async function markUsed() {
    if (!item) return;
    try {
      setErr(null);
      const res = await fetch(`/api/mycoupon/${encodeURIComponent(item._id)}/use`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const json = (await res.json().catch(() => null)) as ApiResp | null;
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || `Use failed (${res.status})`);
      }
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Use failed");
    }
  }

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const canUse = useMemo(() => {
    if (!item) return false;
    const exp = new Date(item.expiresAt).getTime();
    return item.status === "active" && !Number.isNaN(exp) && exp > Date.now();
  }, [item]);

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
          <button
            type="button"
            onClick={() => router.push("/main/mycoupon")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90
              backdrop-blur-xl hover:bg-white/15 active:scale-[0.99] transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="text-sm font-bold text-white/90">My Coupon</div>
          <div className="w-[76px]" />
        </div>

        {loading ? (
          <div className="mt-4 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
            Loading...
          </div>
        ) : null}

        {err ? (
          <div className="mt-4 rounded-3xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-50">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="h-4 w-4" />
              Error
            </div>
            <div className="mt-1 opacity-90">{err}</div>
          </div>
        ) : null}

        {item ? (
          <>
            {/* Coupon card */}
            <div className="mt-4 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <div className="p-4 flex gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/15 bg-white/5">
                  {item.rewardImage ? (
                    <Image
                      src={item.rewardImage}
                      alt="reward"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-white/90 truncate">
                    {item.rewardTitle}
                  </div>
                  <div className="mt-0.5 text-xs text-white/65 line-clamp-2">
                    {item.rewardDesc || "-"}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1">
                      ใช้แต้ม {item.pointType} {item.pointCost}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1">
                      สถานะ: {item.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-3 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    หมดอายุ: <span className="text-white/90 font-bold">{fmtTime(item.expiresAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR */}
            <div className="mt-4 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <div className="p-4">
                <div className="text-sm font-extrabold text-white/90">QR Code</div>
                <div className="mt-1 text-xs text-white/60">
                  แสดงให้พนักงาน/ระบบสแกนเพื่อใช้งาน
                </div>

                <div className="mt-4 flex justify-center">
                  <div className="relative h-[240px] w-[240px] overflow-hidden rounded-3xl bg-white p-3">
                    {qrDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={qrDataUrl} alt="qr" className="h-full w-full object-contain" />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-gray-600 text-sm">
                        No QR data
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-3 text-xs text-white/80">
                  <div className="font-bold text-white/90">Code</div>
                  <div className="mt-1 break-all">{item.couponCode || "-"}</div>
                  <div className="mt-2 font-bold text-white/90">QR Text</div>
                  <div className="mt-1 break-all">{item.qrText || "-"}</div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    disabled={!canUse}
                    onClick={markUsed}
                    className="w-full h-12 rounded-2xl font-extrabold text-sm text-gray-900
                      bg-white hover:-translate-y-px active:scale-[0.99] transition
                      disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {canUse ? "Mark as Used (Demo)" : "Cannot use"}
                  </button>

                  <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-white/55">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    * ปุ่มนี้เป็น demo (จริง ๆ ควรให้ฝั่งสแกนเรียก API use)
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <style>{`button{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

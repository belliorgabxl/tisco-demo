"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import QRCode from "qrcode";
import { REWARDS } from "@/resource/reward";

export default function MyCouponDetailClient({ id }: { id: string }) {
  const [data, setData] = useState<any>(null);
  const [qr, setQr] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/mycoupon/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) throw new Error(json?.message || "load failed");

        if (!alive) return;

        setData(json.data);

        const qrValue = String(json.data.qrToken || json.data.code || "");
        const url = await QRCode.toDataURL(qrValue, { margin: 1, width: 320 });
        if (alive) setQr(url);
      } catch {
        if (alive) setData(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="relative min-h-dvh flex justify-center px-4 py-4 text-sky-50">
        <section className="w-full max-w-[520px]">Loading...</section>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="relative min-h-dvh flex justify-center px-4 py-4 text-sky-50">
        <section className="w-full max-w-[520px]">Not found</section>
      </main>
    );
  }

  const reward = REWARDS[data.rewardId];

  return (
    <main className="relative min-h-dvh flex justify-center px-4 py-4 text-sky-50">
      <section className="w-full max-w-[520px] relative pb-28">
        <div className="flex items-center justify-between">
          <Link
            href="/main/mycoupon"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="text-sm font-bold text-white/90">Use Coupon</div>
          <div className="w-[76px]" />
        </div>

        <div className="mt-3 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl">
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <Image
              src={data.image || reward?.image || "/data/reward/reward-1.png"}
              alt={data.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </div>

          <div className="p-4">
            <div className="text-lg font-extrabold">{data.title}</div>
            <div className="mt-1 text-sm text-white/70">{data.description}</div>

            <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
              <div className="text-xs font-bold text-white/75">QR Code</div>
              <div className="mt-3 flex justify-center">
                {qr ? (
                  <img src={qr} alt="qr" className="h-[220px] w-[220px] rounded-2xl bg-white p-2" />
                ) : (
                  <div className="h-[220px] w-[220px] rounded-2xl bg-white/10" />
                )}
              </div>

              <div className="mt-3 text-center text-xs text-white/60">
                Code: <span className="text-white/85 font-bold">{data.code}</span>
              </div>
              <div className="mt-1 text-center text-[11px] text-white/50">
                Exp: {new Date(data.expiresAt).toLocaleString()}
              </div>
            </div>

            {reward?.highlights?.length ? (
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="text-xs font-bold text-white/75">Highlights</div>
                <ul className="mt-2 space-y-2 text-sm text-white/70">
                  {reward.highlights.map((t: string, idx: number) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-200/80" />
                      <span className="flex-1">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

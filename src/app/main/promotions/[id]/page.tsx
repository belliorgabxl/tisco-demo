import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Timer } from "lucide-react";
import { getPromotion } from "@/resource/promotions";

function daysLeft(endAt: string) {
  const d = new Date(endAt).getTime();
  if (Number.isNaN(d)) return null;
  const diff = d - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function PromotionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = getPromotion(id);

  if (!p) {
    return (
      <main className="min-h-dvh flex items-center justify-center text-white">
        Not found
      </main>
    );
  }

  const left = daysLeft(p.endAt);

  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center py-4 text-sky-50">
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
        {/* Top bar */}
        <div className="flex items-center justify-between px-4">
          <Link
            href="/main/promotion"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90
              backdrop-blur-xl hover:bg-white/15 active:scale-[0.99] transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="text-sm font-bold text-white/90">Promotion</div>
          <div className="w-[76px]" />
        </div>

        <div className="mt-3 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl
          shadow-[0_14px_30px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <div className="relative w-full aspect-[16/10]">
            <Image
              src={p.image}
              alt={p.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-extrabold text-white/90 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {p.tag}
            </div>

            {left !== null && left <= 7 ? (
              <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-extrabold text-amber-100 backdrop-blur">
                <Timer className="h-3.5 w-3.5" />
                {left <= 0 ? "Ends today" : `Ends in ${left}d`}
              </div>
            ) : null}
          </div>

          <div className="p-4">
            <div className="text-lg font-extrabold text-white/95">{p.title}</div>
            <div className="mt-1 text-sm text-white/75">{p.desc}</div>

            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-extrabold text-white/85">
                Eligible: {p.bu}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="text-xs font-extrabold text-white/85">Highlights</div>
              <ul className="mt-2 space-y-2 text-sm text-white/75">
                {p.highlights.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-200/80" />
                    <span className="flex-1">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="text-xs font-extrabold text-white/85">Terms</div>
              <ol className="mt-2 space-y-2 text-sm text-white/75 list-decimal list-inside">
                {p.terms.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ol>
            </div>

            <div className="mt-4">
              <Link
                href={p.ctaHref ?? "/main/myqr"}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold
                  bg-white text-gray-900
                  shadow-[0_18px_38px_rgba(45,110,255,0.18),0_8px_18px_rgba(88,197,255,0.10)]
                  hover:-translate-y-px active:scale-[0.99] transition"
              >
                {p.ctaLabel ?? "Use now"}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

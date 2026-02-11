"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Sparkles,
  Wallet,
  Shield,
  Crown,
} from "lucide-react";
import Image from "next/image";
import { CreditSummary } from "@/resource/type";
import Link from "next/link";

type PointType = "TISCO" | "TINSURE" | "TWEALTH" | "JPOINT";

const ALL_POINT_TYPES: {
  key: PointType;
  title: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "TISCO",
    title: "TISCO Point",
    desc: "แต้มจากบริการ TISCO สำหรับสิทธิประโยชน์ต่าง ๆ",
    icon: (
      <Image
        src="/logo/tisco-logo.png"
        alt="TISCO Point"
        width={20}
        height={20}
        className="h-10 w-10 bg-white rounded-full object-contain"
        priority
      />
    ),
  },
  {
    key: "TINSURE",
    title: "TInsure Point",
    desc: "แลก/โอนแต้มสำหรับสิทธิประโยชน์สายประกัน",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    key: "TWEALTH",
    title: "TWealth Point",
    desc: "โอนแต้มไปใช้กับสิทธิพิเศษสายการลงทุน",
    icon: <Crown className="h-5 w-5" />,
  },
  {
    key: "JPOINT",
    title: "J-Point",
    desc: "ระบบสะสมคะแนนในเครือเจมาร์ท",
    icon: (
      <Image
        src="/logo/jpoint-logo.png"
        alt="J-Point"
        width={20}
        height={20}
        className="h-10 w-10 object-contain "
        priority
      />
    ),
  },
];

function normalizePointType(v: string | null): PointType | null {
  if (!v) return null;
  const s = String(v).trim().toUpperCase();

  if (s === "TISCO" || s === "TISCO_POINT" || s === "POINT_TISCO")
    return "TISCO";
  if (s === "TINSURE" || s === "TINSURE_POINT") return "TINSURE";
  if (s === "TWEALTH" || s === "TWEALTH_POINT") return "TWEALTH";
  if (s === "JPOINT" || s === "J-POINT" || s === "J_POINT") return "JPOINT";

  return null;
}

export default function Page() {
  const router = useRouter();

  const [currentType, setCurrentType] = useState<PointType | null>(null);
  const [selectedTo, setSelectedTo] = useState<PointType | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("activePointType");
    const parsed = normalizePointType(raw);

    setCurrentType(parsed);

    setSelectedTo(null);
  }, []);

  const options = useMemo(() => {
    if (!currentType) return ALL_POINT_TYPES;
    return ALL_POINT_TYPES.filter((x) => x.key !== currentType);
  }, [currentType]);

  const currentLabel = useMemo(() => {
    const found = ALL_POINT_TYPES.find((x) => x.key === currentType);
    return found?.title ?? "Unknown";
  }, [currentType]);

  function getBalanceByType(type: PointType, credit: CreditSummary) {
    if (type === "TISCO") return credit.tiscoPoint;
    if (type === "TWEALTH") return credit.twealthPoint;
    return credit.tinsurePoint;
  }

  const [credit, setCredit] = useState<CreditSummary | null>(null);
  const currentBalance = useMemo(() => {
    if (!credit || !currentType) return null;
    return getBalanceByType(currentType, credit);
  }, [credit, currentType]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/credits", { cache: "no-store" });
      const json = await res.json();
      if (json?.success) setCredit(json.data);
    })();
  }, []);
  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center px-4 py-6 text-sky-50">
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
      <div
        aria-hidden
        className="absolute -top-44 -left-40 -z-10 h-[520px] w-[520px] blur-[2px]
        bg-[radial-gradient(circle_at_30%_30%,rgba(88,197,255,0.30),transparent_60%)]"
      />
      <div
        aria-hidden
        className="absolute -bottom-56 -right-48 -z-10 h-[560px] w-[560px] blur-[2px]
        bg-[radial-gradient(circle_at_60%_60%,rgba(45,110,255,0.26),transparent_62%)]"
      />

      {/* Content */}
      <div className="w-full max-w-[520px]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs text-sky-100/90">
              <Sparkles className="h-4 w-4" />
              Transfer Center
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              Transfer-Point
            </h1>

            <p className="mt-1 text-sm text-sky-100/75">
              Only other point types are shown as transfer destinations.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-3 py-2">
            <BadgeCheck className="h-4 w-4 text-sky-200" />
            <div className="text-xs leading-tight">
              <div className="text-sky-100/70">Current</div>
              <div className="font-medium">
                {currentType ? currentLabel : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="sm:hidden mt-4 rounded-2xl border border-white/12 backdrop-blur-sm bg-white/10 px-4 py-3 flex items-center justify-between">
          <div className="text-sm">
            <div className="text-sky-100/70">Current balance</div>
            <div className="font-semibold">
              {currentType ? currentLabel : "Not found in session"}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-xl blur-lg opacity-60 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.45),transparent_60%)]" />
            <div className="relative rounded-xl border border-sky-200/25 bg-[linear-gradient(90deg,rgba(56,189,248,0.22),rgba(59,130,246,0.18))] px-3 py-1.5 text-sm font-semibold text-sky-50">
              {typeof currentBalance === "number" ? (
                <span className="tabular-nums text-xl">
                  {currentBalance.toLocaleString()} point
                </span>
              ) : (
                <span className="text-sky-100/60">—</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-white/12 bg-white/10 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-sky-100/90">
                เลือก Point Type ที่จะโอนไป
              </p>
              <p className="text-xs text-sky-100/60">
                {options.length} ตัวเลือก
              </p>
            </div>

            <div className="mt-3 grid gap-3">
              {options.map((it) => {
                const active = selectedTo === it.key;

                return (
                  <Link
                    href={`/main/transfer-point/${it.key}`}
                    key={it.key}
                    type="button"
                    onClick={() => setSelectedTo(it.key)}
                    className={[
                      "group relative w-full text-left rounded-2xl border transition",
                      active
                        ? "border-sky-300/40 bg-sky-600/35"
                        : "border-white/10 bg-slate-900/80 hover:bg-slate-800/90",
                    ].join(" ")}
                  >
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "inline-flex h-10 w-10 items-center justify-center rounded-xl border",
                            active
                              ? "border-sky-200/40 bg-sky-500/25"
                              : "border-white/10 bg-white/10",
                          ].join(" ")}
                        >
                          {it.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-base font-semibold">
                              {it.title}
                            </p>
                          </div>
                          <p className="mt-1 text-xs text-sky-100/70 line-clamp-1">
                            {it.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      aria-hidden
                      className={[
                        "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition",
                        active ? "opacity-100" : "group-hover:opacity-60",
                        "shadow-[0_0_0_1px_rgba(125,211,252,0.25),0_0_40px_rgba(56,189,248,0.12)]",
                      ].join(" ")}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

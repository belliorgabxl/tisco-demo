"use client";

import React, { useMemo } from "react";
import type { PointType } from "@/resource/constant";

type Theme = {
  mainBg: string;
  glowTL: string;
  glowBR: string;

  overlayBg: string;
  overlaySize: string;
  overlayOpacity: number;

  overlayMask?: string;
};

const THEMES: Record<PointType, Theme> = {
  // TISCO: ฟ้า/sky + grid
  TISCO: {
    mainBg:
      "radial-gradient(1200px 600px at 18% 10%, rgba(88,197,255,0.34), transparent 56%)," +
      "radial-gradient(900px 520px at 92% 22%, rgba(45,110,255,0.28), transparent 60%)," +
      "linear-gradient(180deg, #07162F 0%, #061225 55%, #040A14 100%)",
    glowTL:
      "radial-gradient(circle at 30% 30%, rgba(88,197,255,0.22), transparent 64%)",
    glowBR:
      "radial-gradient(circle at 60% 60%, rgba(45,110,255,0.18), transparent 66%)",
    overlayBg:
      "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)," +
      "linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
    overlaySize: "28px 28px",
    overlayOpacity: 0.52,
    overlayMask: "radial-gradient(ellipse at center, black 10%, transparent 72%)",
  },

  // TINSURE: ✅ เปลี่ยนเป็นน้ำเงินชัด ๆ (ไม่ม่วง) + dot matrix
  TINSURE: {
    mainBg:
      "radial-gradient(1200px 620px at 22% 12%, rgba(201, 100, 65,0.24), transparent 58%)," +
      "radial-gradient(900px 520px at 92% 22%, rgba(59,130,246,0.26), transparent 60%)," +
      "linear-gradient(180deg, #071A33 0%, #061226 55%, #040A14 100%)",
    glowTL:
      "radial-gradient(circle at 60% 30%, rgba(14,165,233,0.18), transparent 66%)",
    glowBR:
      "radial-gradient(circle at 20% 60%, rgba(59,130,246,0.16), transparent 68%)",
    overlayBg: "radial-gradient(rgba(255,255,255,0.3) 2px, transparent 1px)",
    overlaySize: "18px 18px",
    overlayOpacity: 0.9,
    overlayMask: "radial-gradient(ellipse at top, black 30%, transparent 74%)",
  },

  TWEALTH: {
    mainBg:
      "radial-gradient(1200px 640px at 18% 12%, rgba(34,211,238,0.20), transparent 60%)," +
      "radial-gradient(900px 520px at 90% 25%, rgba(37,99,235,0.22), transparent 62%)," +
      "linear-gradient(180deg, #071B2C 0%, #061125 55%, #040A14 100%)",
    glowTL:
      "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.14), transparent 68%)",
    glowBR:
      "radial-gradient(circle at 60% 60%, rgba(37,99,235,0.14), transparent 68%)",
    overlayBg:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 12px)",
    overlaySize: "auto",
    overlayOpacity: 0.9,
    overlayMask: "radial-gradient(ellipse at center, black 34%, transparent 76%)",
  },
};


export default function ThemeBackground({ type }: { type: PointType }) {
  const theme = useMemo(() => THEMES[type] ?? THEMES.TISCO, [type]);

  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: theme.mainBg }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: theme.overlayBg,
          backgroundSize: theme.overlaySize,
          opacity: theme.overlayOpacity,
          WebkitMaskImage: theme.overlayMask,
          maskImage: theme.overlayMask,
        }}
      />

      <div
        aria-hidden
        className="absolute -top-44 -left-40 -z-10 h-[520px] w-[520px] blur-[2px]"
        style={{ backgroundImage: theme.glowTL }}
      />
      <div
        aria-hidden
        className="absolute -bottom-56 -right-48 -z-10 h-[560px] w-[560px] blur-[2px]"
        style={{ backgroundImage: theme.glowBR }}
      />
    </>
  );
}

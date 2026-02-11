import { toneClasses } from "@/libs/utils/tier-tone";
import { TierTone } from "@/resource/tier";
import { Star } from "lucide-react";

export function TierBadge({
  text,
  variant = "default",
}: {
  text: string;
  variant?: "default" | "top" | "elite";
}) {
  const cls =
    variant === "top"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
      : variant === "elite"
        ? "bg-violet-500/15 text-violet-200 border-violet-400/30"
        : "bg-white/5 text-white/80 border-white/10";
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
        cls,
      ].join(" ")}
    >
      <Star className="h-3.5 w-3.5 text-yellow-300" />
      {text}
    </span>
  );
}

export function TierChip({
  name,
  active,
  tone,
  onClick,
}: {
  name: string;
  active: boolean;
  tone?: TierTone;
  onClick: () => void;
}) {
  const t = toneClasses(tone);

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm transition border inline-flex items-center gap-2",
        active ? `${t.chip} ${t.ring}` : t.chip, // ✅ ใช้ chip เสมอ
      ].join(" ")}
    >
      <span className={["h-2 w-2 rounded-full", t.dot].join(" ")} />
      {name}
    </button>
  );
}

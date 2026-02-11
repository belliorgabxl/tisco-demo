import { TierTone } from "@/resource/tier";

export function toneClasses(tone?: TierTone) {
  switch (tone) {
    case "platinum":
      return {
        chip: "bg-gradient-to-r from-blue-700 to-purple-200/50 border-none text-white ",
        badge: "bg-white text-white",
        ring: "ring-2 ring-blue-200",
        dot: "bg-white",
      };
    case "gold":
      return {
        chip: "bg-gradient-to-r from-yellow-700 to-yellow-200/50 border-none text-white hover:bg-amber-300/15",
        badge: "bg-white text-white",
         ring: "ring-2 ring-blue-200",
        dot: "bg-white",
      };
    case "silver":
      return {
        chip: "bg-gradient-to-r from-gray-700 to-zinc-200/50 border-none text-white hover:bg-amber-300/15",
        badge: "bg-white text-white",
         ring: "ring-2 ring-blue-200",
        dot: "bg-white",
      };
    case "privilege":
      return {
        chip: "bg-violet-300/10 border-violet-300/25 text-violet-100 hover:bg-violet-300/15",
        badge: "bg-violet-300/10 border-violet-300/25 text-violet-100",
         ring: "ring-2 ring-blue-200",
        dot: "bg-violet-300",
      };
    case "normal":
      return {
        chip: "bg-white/5 border-white/10 text-white/80 hover:bg-white/8",
        badge: "bg-white/5 border-white/10 text-white/80",
         ring: "ring-2 ring-blue-200",
        dot: "bg-white/70",
      };
    default:
      return {
        chip: "bg-white/5 border-white/10 text-white/80 hover:bg-white/8",
        badge: "bg-white/5 border-white/10 text-white/80",
         ring: "ring-2 ring-blue-200",
        dot: "bg-white/70",
      };
  }
}

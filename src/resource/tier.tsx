import { Crown, ShieldCheck, Sparkles } from "lucide-react";

export type TierTone =
  | "platinum"
  | "gold"
  | "silver"
  | "privilege"
  | "normal"
  | "default";

export type TierItem = {
  name: string;
  desc: string;
  tag?: string;
  tone?: TierTone;
};
export type TierGroup = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
  iconColor: string;
  iconBg: string;
  tiers: TierItem[];
};

export const TIER_GROUPS: TierGroup[] = [
  {
    key: "tisco",
    title: "TISCO Point",
    subtitle: "ระดับสมาชิกสำหรับการสะสมแต้มในกลุ่ม TISCO",
    icon: Crown,
    iconColor: "text-yellow-500",
    iconBg: "bg-white/40",
    accent:
      "from-emerald-500/50 via-lime-500/20 to-transparent border-emerald-400/35",
    tiers: [
      {
        name: "Platinum",
        desc: "ระดับสูงสุดของ TISCO Point",
        tag: "Top",
        tone: "platinum",
      },
      {
        name: "Gold",
        desc: "ระดับสมาชิกพรีเมียมสำหรับลูกค้าประจำ",
        tone: "gold",
      },
      {
        name: "Silver",
        desc: "ระดับเริ่มต้นสำหรับการสะสมแต้ม",
        tone: "silver",
      },
    ],
  },
  {
    key: "twealth",
    title: "TWealth Point",
    subtitle: "ระดับสมาชิกสำหรับลูกค้ากลุ่ม Wealth",
    icon: Sparkles,
    iconColor: "text-emerald-200",
    iconBg: "bg-white/50",
    accent:
      "from-sky-500/50 via-violet-500/20 to-transparent border-sky-400/35",
    tiers: [
      {
        name: "Platinum Wealth",
        desc: "ระดับสูงสุดสำหรับกลุ่ม Wealth",
        tag: "Elite",
      },
      { name: "Private Wealth", desc: "ระดับสำหรับลูกค้ากลุ่ม Private" },
    ],
  },
  {
    key: "tinsure",
    title: "TInsure Point",
    iconColor: "text-blue-500",
    iconBg: "bg-white/50",
    subtitle: "ระดับสมาชิกสำหรับกลุ่มประกัน (Insure)",
    icon: ShieldCheck,
    accent:
      "from-amber-500/50 via-orange-500/20 to-transparent border-amber-400/35",
    tiers: [
      { name: "Privilege", desc: "สิทธิพิเศษมากกว่า เหมาะกับลูกค้า VIP" },
      { name: "Normal", desc: "ระดับมาตรฐานสำหรับผู้ใช้งานทั่วไป" },
    ],
  },
];

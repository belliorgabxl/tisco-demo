import type { PointType } from "./constant";

export type PromotionTag =
  | "HOT DEAL"
  | "EXCLUSIVE"
  | "FLASH"
  | "NEW"
  | "MISSION";

export type Promotion = {
  id: string;
  tag: PromotionTag;

  title: string;
  desc: string;

  image: string; // banner/cover
  bu: PointType | "ALL";

  startAt: string; // ISO string
  endAt: string; // ISO string

  highlights: string[];
  terms: string[];

  ctaLabel?: string;
  ctaHref?: string;
};

export const PROMOTIONS: Promotion[] = [
  {
    id: "double-points-weekend",
    tag: "HOT DEAL",
    title: "Double Points Weekend",
    desc: "รับแต้ม x2 เมื่อทำรายการในหมวดที่ร่วมรายการ",
    image: "/data/reward/reward-2.png",
    bu: "ALL",
    startAt: "2026-02-01T00:00:00.000Z",
    endAt: "2026-02-29T23:59:59.000Z",
    highlights: [
      "รับแต้มเพิ่มอัตโนมัติ",
      "รองรับทุก BU (TISCO / TINSURE / TWEALTH)",
      "มีจำนวนสิทธิ์ต่อเดือน",
    ],
    terms: [
      "เฉพาะรายการที่เข้าร่วมโปรโมชัน",
      "ระบบคำนวณแต้มภายใน 24 ชม.",
      "บริษัทขอสงวนสิทธิ์เปลี่ยนแปลงเงื่อนไขโดยไม่แจ้งล่วงหน้า",
    ],
    ctaLabel: "Use now",
    ctaHref: "/main/myqr",
  },
  {
    id: "loyalty-lounge",
    tag: "EXCLUSIVE",
    title: "Loyalty Lounge Privilege",
    desc: "สิทธิ์พิเศษเฉพาะสมาชิกที่เข้าเงื่อนไข รับดีลเพิ่ม/เดือน",
    image: "/data/reward/reward-5.png",
    bu: "TWEALTH",
    startAt: "2026-02-10T00:00:00.000Z",
    endAt: "2026-03-31T23:59:59.000Z",
    highlights: [
      "สิทธิ์เฉพาะ BU ที่กำหนด",
      "มีรอบจำกัด/เดือน",
      "เหมาะสำหรับลูกค้า TWealth",
    ],
    terms: ["ต้องเข้าเงื่อนไขสมาชิก", "ใช้สิทธิ์ตามรอบที่กำหนด"],
    ctaLabel: "View details",
  },
  {
    id: "flash-redeem-50",
    tag: "FLASH",
    title: "Redeem 50% Off",
    desc: "ใช้แต้มแลกส่วนลดทันที สูงสุด 500.-",
    image: "/data/reward/reward-3.png",
    bu: "TISCO",
    startAt: "2026-02-11T13:00:00.000Z",
    endAt: "2026-02-11T17:00:00.000Z",
    highlights: ["เวลาจำกัด", "เหมาะกับสายช้อป", "ลดสูงสุด 500.-"],
    terms: ["จำกัดสิทธิ์ต่อวัน/บัญชี", "ต้องทำรายการภายในช่วงเวลา"],
    ctaLabel: "Use now",
    ctaHref: "/main/myqr",
  },
  {
    id: "insurance-boost",
    tag: "NEW",
    title: "Insurance Boost",
    desc: "รับแต้มเพิ่มเมื่อซื้อแผนที่ร่วมรายการ",
    image: "/data/reward/reward-4.png",
    bu: "TINSURE",
    startAt: "2026-02-01T00:00:00.000Z",
    endAt: "2026-04-30T23:59:59.000Z",
    highlights: ["แต้มเข้าภายใน 7 วัน", "เฉพาะแผนที่ร่วมรายการ"],
    terms: ["ตรวจสอบเงื่อนไขในหน้ารายละเอียด"],
  },
];

export function getPromotion(id: string): Promotion | null {
  return PROMOTIONS.find((p) => p.id === id) ?? null;
}

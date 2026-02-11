export type RewardDetail = {
  id: string;
  title: string;
  desc: string;
  image: string;
  badge?: string;
  points: number;
  tier?: string;
  highlights: string[];
  howToUse: string[];
};

export const REWARDS: Record<string, RewardDetail> = {
  "free-coupon": {
    id: "free-coupon",
    title: "Free Coupon",
    desc: "แลกของรางวัล / ดีลเด็ด",
    image: "/data/reward/reward-1.png",
    badge: "NEW",
    points: 10,
    highlights: [
      "คูปองใช้ได้กับร้านค้าที่ร่วมรายการ",
      "ใช้ได้ภายใน 30 วันหลังแลก",
      "จำนวนจำกัดต่อเดือน",
    ],
    howToUse: [
      "กด Redeem เพื่อแลกสิทธิ์",
      "รับโค้ด/คูปองในหน้า My Rewards",
      "นำไปใช้ที่ร้านค้าหรือหน้า Checkout",
    ],
  },

  "tisco-100-points": {
    id: "tisco-100-points",
    title: "100 TISCO Points",
    desc: "สิทธิพิเศษตาม Tier",
    image: "/data/reward/reward-2.png",
    badge: "VIP",
    points: 100,
    tier: "Gold+",
    highlights: [
      "สิทธิ์เฉพาะสมาชิก Tier ที่กำหนด",
      "เหมาะสำหรับแลกส่วนลดทันที",
      "รองรับแคมเปญบางช่วงเวลา",
    ],
    howToUse: [
      "ตรวจสอบ Tier ก่อนแลก",
      "กด Redeem แล้วระบบจะตัดแต้ม",
      "สิทธิ์จะถูกเพิ่มในบัญชีของคุณทันที",
    ],
  },

  "coupon-10-points": {
    id: "coupon-10-points",
    title: "10 TISCO Points",
    desc: "คูปองส่วนลดทั้งหมด",
    image: "/data/reward/reward-3.png",
    badge: "HOT",
    points: 10,
    highlights: [
      "ใช้แต้มแลกคูปองส่วนลดได้ทันที",
      "ใช้ได้กับดีลที่ร่วมรายการ",
      "จำนวนจำกัดต่อวัน/ต่อบัญชี",
    ],
    howToUse: [
      "กด Redeem เพื่อรับคูปอง",
      "คูปองจะอยู่ในหน้า My Rewards",
      "นำไปใช้ตอนชำระเงิน/Checkout",
    ],
  },

  "insurance-benefits": {
    id: "insurance-benefits",
    title: "Insurance Benefits",
    desc: "สิทธิ์ประกัน / แคมเปญ",
    image: "/data/reward/reward-4.png",
    badge: "TInsure",
    points: 50,
    highlights: [
      "สิทธิ์ส่วนลดประกันตามรายการ",
      "ใช้ได้กับแผนที่ร่วมรายการ",
      "มีเงื่อนไขตามช่วงเวลาโปรโมชัน",
    ],
    howToUse: [
      "กด Redeem เพื่อรับสิทธิ์",
      "ไปที่หน้าประกันเพื่อเลือกแผน",
      "ใช้สิทธิ์ตอนยืนยันการซื้อ",
    ],
  },

  "wealth-lounge": {
    id: "wealth-lounge",
    title: "Wealth Lounge",
    desc: "ดีลลงทุน / สัมมนา",
    image: "/data/reward/reward-5.png",
    badge: "TWealth",
    points: 80,
    highlights: [
      "สิทธิ์เข้าร่วมกิจกรรมพิเศษ",
      "เหมาะสำหรับลูกค้า TWealth",
      "มีรอบจำกัด โปรดจองล่วงหน้า",
    ],
    howToUse: [
      "กด Redeem เพื่อรับสิทธิ์",
      "เลือกกิจกรรม/รอบที่ต้องการ",
      "แสดง QR ในวันเข้าร่วม",
    ],
  },
};
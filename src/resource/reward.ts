import { PointType, RewardPointAction } from "./constant";

export type RewardType = "coupon" | "points";

export type RewardDetailBase = {
  id: string;
  title: string;
  desc: string;
  image: string;
  badge?: string;
  tier?: string;
  points: number;
  highlights: string[];
  howToUse: string[];
};

export type RewardDetail = CouponRewardDetail | PointsRewardDetail;

export type CouponRewardDetail = RewardDetailBase & {
  rewardType: "coupon";
  pointAction: { mode: "spend"; pointType: PointType; amount: number };
};

export type PointsRewardDetail = RewardDetailBase & {
  rewardType: "points";
  pointAction: { mode: "earn"; pointType: PointType; amount: number };
};

export const REWARDS: Record<string, RewardDetail> = {

  "free-coupon": {
    id: "1",
    title: "Veranda Resort Discount 20%",
    desc: "Veranda Resort Discount 20% การแลกคูปองเป็นไปตามเงื่อนไขตามที่บริษัทกำหนด",
    image: "/data/reward/reward-1.png",
    badge: "NEW",
    points: 0,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TISCO", amount: 0 },
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
    id: "2",
    title: "Starbucks E-Voucher 100 THB",
    desc: "แลกแต้มรับ Starbucks E-Voucher มูลค่า 100 บาท ใช้ได้กับสาขาที่ร่วมรายการ ภายในระยะเวลาที่กำหนด",
    image: "/data/reward/reward-2.png",
    badge: "VIP",
    points: 100,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TISCO", amount: 100 },
    tier: "Gold+",
    highlights: [
      "สิทธิ์เฉพาะสมาชิก Tier ที่กำหนด",
      "แลกคูปองแล้วเก็บไว้ใช้ทีหลังได้",
      "จำนวนจำกัดต่อวัน/ต่อบัญชี",
    ],
    howToUse: [
      "ตรวจสอบ Tier ก่อนทำรายการ",
      "กด Redeem เพื่อรับคูปอง",
      "ไปที่หน้า My Coupon เพื่อใช้งาน",
    ],
  },

  "coupon-10-points": {
    id: "3",
    title: "TISCO Merchandise - Tote Bag",
    desc: "แลกแต้มรับของที่ระลึก Tote Bag จำนวนจำกัด เหมาะสำหรับพกพาใช้งานในชีวิตประจำวัน เงื่อนไขตามที่บริษัทกำหนด",
    image: "/data/reward/reward-3.png",
    badge: "HOT",
    points: 10,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TISCO", amount: 10 },
    highlights: [
      "ใช้แต้มแลกสิทธิ์ได้ทันที",
      "จำนวนจำกัดต่อวัน/ต่อบัญชี",
      "เงื่อนไขเป็นไปตามที่บริษัทกำหนด",
    ],
    howToUse: [
      "กด Redeem เพื่อรับคูปอง",
      "คูปองจะอยู่ในหน้า My Coupon",
      "นำไปใช้ตอนยืนยันสิทธิ์/Checkout",
    ],
  },

  "tisco-50-points-coffee": {
    id: "4",
    title: "Café Partner - Drink 1 Get 1",
    desc: "แลกแต้มรับดีลเครื่องดื่ม 1 แถม 1 กับร้านคาเฟ่พันธมิตร เฉพาะสาขาที่ร่วมรายการ",
    image: "/data/reward/reward-4.png",
    badge: "LIMITED",
    points: 50,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TISCO", amount: 50 },
    highlights: [
      "ใช้ได้กับเมนูที่ร่วมรายการ",
      "จำกัดจำนวนสิทธิ์ต่อวัน",
      "แสดงโค้ด/QR เพื่อรับสิทธิ์",
    ],
    howToUse: [
      "กด Redeem เพื่อรับคูปอง",
      "ไปหน้า My Coupon และกดใช้งาน",
      "แสดง QR ให้พนักงานสแกน",
    ],
  },

  "tisco-200-points-movie": {
    id: "5",
    title: "Movie Ticket Discount 100 THB",
    desc: "แลกแต้มรับส่วนลดตั๋วหนัง 100 บาท สำหรับโรงภาพยนตร์ที่ร่วมรายการ",
    image: "/data/reward/reward-5.png",
    badge: "POPULAR",
    points: 200,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TISCO", amount: 200 },
    highlights: [
      "ใช้ได้กับรอบฉายที่ร่วมรายการ",
      "จำกัดสิทธิ์ต่อบัญชี",
      "เงื่อนไขเป็นไปตามที่บริษัทกำหนด",
    ],
    howToUse: [
      "กด Redeem เพื่อรับคูปอง",
      "นำโค้ดไปกรอกในหน้าชำระเงิน",
      "หรือแสดง QR ตอนซื้อหน้าสาขา",
    ],
  },

  "tisco-free-shipping": {
    id: "6",
    title: "Free Shipping Voucher",
    desc: "คูปองส่งฟรีสำหรับร้านค้าออนไลน์พันธมิตร ใช้ได้ตามเงื่อนไขที่กำหนด",
    image: "/data/reward/reward-6.png",
    badge: "FREE",
    points: 0,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TISCO", amount: 0 },
    highlights: [
      "คูปองใช้ฟรี (0 แต้ม)",
      "ใช้ได้กับสินค้าที่ร่วมรายการ",
      "จำกัดจำนวนสิทธิ์ต่อวัน",
    ],
    howToUse: [
      "กด Redeem เพื่อรับคูปอง",
      "ไปหน้า My Coupon และกดใช้",
      "ระบบจะใช้โค้ดให้ตอน Checkout",
    ],
  },

  // -------- TINSURE --------
  "tinsure-free-checkup": {
    id: "101",
    title: "Health Checkup Privilege",
    desc: "สิทธิ์ตรวจสุขภาพเบื้องต้นกับคลินิกพันธมิตร ตามแพ็กเกจที่กำหนด",
    image: "/data/reward/reward-7.png",
    badge: "NEW",
    points: 0,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TINSURE", amount: 0 },
    highlights: [
      "สิทธิ์ใช้ฟรี (0 แต้ม)",
      "ต้องนัดหมายล่วงหน้า",
      "ใช้ได้ภายในระยะเวลาที่กำหนด",
    ],
    howToUse: [
      "กด Redeem เพื่อรับสิทธิ์",
      "ไปหน้า My Coupon เพื่อดูรายละเอียด",
      "แสดง QR/โค้ดที่คลินิก",
    ],
  },

  "tinsure-300-points-premium": {
    id: "102",
    title: "Insurance Premium Discount 300 THB",
    desc: "แลกแต้มรับส่วนลดเบี้ยประกัน 300 บาท สำหรับผลิตภัณฑ์ที่ร่วมรายการ",
    image: "/data/reward/reward-8.png",
    badge: "VIP",
    points: 300,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TINSURE", amount: 300 },
    tier: "Gold+",
    highlights: [
      "ส่วนลดใช้ได้กับแผนที่ร่วมรายการ",
      "จำกัดสิทธิ์ต่อบัญชี/ต่อเดือน",
      "ต้องยืนยันตัวตนก่อนใช้สิทธิ์",
    ],
    howToUse: [
      "กด Redeem เพื่อรับคูปองส่วนลด",
      "ไปหน้า My Coupon และกดใช้งาน",
      "กรอกโค้ด/แสดง QR ตอนทำรายการ",
    ],
  },

  "tinsure-150-points-roadside": {
    id: "103",
    title: "Roadside Assistance Voucher",
    desc: "แลกแต้มรับสิทธิ์ช่วยเหลือฉุกเฉินบนท้องถนน ตามเงื่อนไขที่กำหนด",
    image: "/data/reward/reward-9.png",
    badge: "HOT",
    points: 150,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TINSURE", amount: 150 },
    highlights: [
      "บริการช่วยเหลือฉุกเฉินตามรายการ",
      "ใช้งานได้ 1 ครั้งต่อคูปอง",
      "ต้องใช้ภายในเวลาที่กำหนด",
    ],
    howToUse: [
      "กด Redeem เพื่อรับสิทธิ์",
      "ไปหน้า My Coupon เพื่อดูโค้ด",
      "ติดต่อ Call Center และแจ้งโค้ด",
    ],
  },

  // -------- TWEALTH --------
  "twealth-free-webinar": {
    id: "201",
    title: "Investment Webinar Pass",
    desc: "สิทธิ์เข้าร่วมสัมมนาการลงทุนออนไลน์รอบพิเศษ (จำกัดจำนวนผู้เข้าร่วม)",
    image: "/data/reward/reward-10.png",
    badge: "NEW",
    points: 0,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TWEALTH", amount: 0 },
    highlights: [
      "สิทธิ์ใช้ฟรี (0 แต้ม)",
      "จำกัดจำนวนผู้เข้าร่วม",
      "รับลิงก์เข้าร่วมในหน้า My Coupon",
    ],
    howToUse: [
      "กด Redeem เพื่อรับสิทธิ์",
      "ไปหน้า My Coupon เพื่อรับลิงก์/QR",
      "เข้าร่วมตามวันและเวลาที่กำหนด",
    ],
  },

  "twealth-500-points-consult": {
    id: "202",
    title: "1:1 Portfolio Consultation (15 mins)",
    desc: "แลกแต้มรับสิทธิ์ปรึกษาพอร์ต 1:1 กับผู้แนะนำการลงทุน (ตามเงื่อนไขที่กำหนด)",
    image: "/data/reward/reward-11.png",
    badge: "VIP",
    points: 500,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TWEALTH", amount: 500 },
    tier: "Platinum",
    highlights: [
      "ปรึกษา 15 นาที (นัดหมายล่วงหน้า)",
      "จำกัดสิทธิ์ต่อบัญชี",
      "ใช้ได้ภายในเวลาที่กำหนด",
    ],
    howToUse: [
      "กด Redeem เพื่อรับสิทธิ์",
      "ไปหน้า My Coupon เพื่อดูรายละเอียด",
      "กดใช้งานเพื่อเริ่มเวลานับถอยหลัง",
    ],
  },

  "twealth-200-points-report": {
    id: "203",
    title: "Market Insight Report",
    desc: "แลกแต้มรับรายงานสรุปตลาดรายสัปดาห์/รายเดือน (ขึ้นกับรอบที่กำหนด)",
    image: "/data/reward/reward-12.png",
    badge: "POPULAR",
    points: 200,
    rewardType: "coupon",
    pointAction: { mode: "spend", pointType: "TWEALTH", amount: 200 },
    highlights: [
      "ดาวน์โหลดรายงานผ่าน My Coupon",
      "จำกัดสิทธิ์ต่อรอบเวลา",
      "เนื้อหาเป็นไปตามทีมวิเคราะห์",
    ],
    howToUse: [
      "กด Redeem เพื่อรับคูปอง",
      "ไปหน้า My Coupon และกดใช้งาน",
      "ดาวน์โหลดรายงานจากลิงก์ที่แสดง",
    ],
  },
};

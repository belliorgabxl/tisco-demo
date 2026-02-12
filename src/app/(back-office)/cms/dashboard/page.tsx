"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Coins,
  Gift,
  Star,
  RefreshCw,
  Shield,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

// Mock Data
const globalStats = {
  totalMembers: 15402,
  activePercentage: 80,
  totalPointsValue: 5200000,
  todayTransactions: { total: 1205, earn: 800, burn: 405 },
};

const inventoryAlerts = [
  {
    company: "TISCO",
    color: "red",
    rewardItem: "Starbucks e-Voucher",
    current: 2,
    total: 50,
    status: "warning",
  },
  {
    company: "TISCO",
    color: "red",
    rewardItem: "กระเป๋าผ้า Limited",
    current: 5,
    total: 20,
    status: "warning",
  },
  {
    company: "Bank",
    color: "blue",
    rewardItem: "ร่ม TISCO Bank",
    current: 80,
    total: 100,
    status: "ok",
  },
  {
    company: "Insure",
    color: "green",
    rewardItem: "Central Voucher",
    current: 90,
    total: 100,
    status: "ok",
  },
];

const campaigns = [
  {
    company: "Bank",
    color: "blue",
    name: "ฝากเงินฝากประจำ Super Rate",
    participants: 45,
    pointsEarned: 450000,
    pointsUsed: 0,
    rewardsUsed: 0,
    privilegesUsed: 0,
  },
  {
    company: "TISCO",
    color: "red",
    name: "แบบสอบถามความสนใจ",
    participants: 120,
    pointsEarned: 12000,
    pointsUsed: 0,
    rewardsUsed: 0,
    privilegesUsed: 0,
  },
  {
    company: "Insure",
    color: "green",
    name: "ประกัน ZCP",
    participants: 10,
    pointsEarned: 2500,
    pointsUsed: 0,
    rewardsUsed: 0,
    privilegesUsed: 0,
  },
  {
    company: "TISCO",
    color: "red",
    name: "โปรโมชั่นสินค้าทั่วไป",
    participants: 230,
    pointsEarned: 45000,
    pointsUsed: 180000,
    rewardsUsed: 85,
    privilegesUsed: 0,
  },
  {
    company: "Bank",
    color: "blue",
    name: "Wealth Management Exclusive",
    participants: 15,
    pointsEarned: 750000,
    pointsUsed: 250000,
    rewardsUsed: 12,
    privilegesUsed: 8,
  },
  {
    company: "Insure",
    color: "green",
    name: "Health Insurance Premium",
    participants: 67,
    pointsEarned: 134000,
    pointsUsed: 45000,
    rewardsUsed: 22,
    privilegesUsed: 15,
  },
];

// Analytics Mock Data
const memberTierData = [
  { name: "Platinum", value: 850, company: "All", color: "#a78bfa" },
  { name: "Gold", value: 3240, company: "All", color: "#fbbf24" },
  { name: "Silver", value: 11312, company: "All", color: "#94a3b8" },
];

const memberTierByCompany = {
  TISCO: [
    { name: "Platinum", value: 320, color: "#a78bfa" },
    { name: "Gold", value: 1200, color: "#fbbf24" },
    { name: "Silver", value: 4180, color: "#94a3b8" },
  ],
  Bank: [
    { name: "Platinum", value: 380, color: "#a78bfa" },
    { name: "Gold", value: 1450, color: "#fbbf24" },
    { name: "Silver", value: 4870, color: "#94a3b8" },
  ],
  Insure: [
    { name: "Platinum", value: 150, color: "#a78bfa" },
    { name: "Gold", value: 590, color: "#fbbf24" },
    { name: "Silver", value: 2262, color: "#94a3b8" },
  ],
};

const pointLiabilityData = [
  { name: "TISCO", value: 1850000, color: "#ef4444" },
  { name: "Bank", value: 2100000, color: "#3b82f6" },
  { name: "Insure", value: 1250000, color: "#22c55e" },
];

const monthlyEarnBurnData = [
  { month: "Jan", earn: 450000, burn: 280000 },
  { month: "Feb", earn: 520000, burn: 310000 },
  { month: "Mar", earn: 580000, burn: 390000 },
  { month: "Apr", earn: 620000, burn: 420000 },
  { month: "May", earn: 690000, burn: 480000 },
  { month: "Jun", earn: 710000, burn: 520000 },
];

const topRedemptionsData = [
  { name: "Starbucks Voucher", count: 185 },
  { name: "Central Voucher", count: 142 },
  { name: "กระเป๋าผ้า Limited", count: 98 },
  { name: "ร่ม TISCO", count: 76 },
  { name: "Grab Voucher", count: 63 },
];

const pointsByActivityData = [
  { activity: "แบบสอบถาม", points: 145000 },
  { activity: "ซื้อประกัน", points: 385000 },
  { activity: "ฝากเงิน", points: 520000 },
  { activity: "ต่ออายุ", points: 280000 },
  { activity: "อื่นๆ", points: 180000 },
];

const stackedMonthlyData = [
  { month: "Jan", TISCO: 120000, Bank: 180000, Insure: 150000 },
  { month: "Feb", TISCO: 145000, Bank: 205000, Insure: 170000 },
  { month: "Mar", TISCO: 168000, Bank: 225000, Insure: 187000 },
  { month: "Apr", TISCO: 185000, Bank: 240000, Insure: 195000 },
  { month: "May", TISCO: 205000, Bank: 265000, Insure: 220000 },
  { month: "Jun", TISCO: 220000, Bank: 280000, Insure: 210000 },
];

type FilterType = "All" | "TISCO" | "Bank" | "Insure";
type UserGranularity = "DAY" | "WEEK" | "MONTH" | "YEAR";

const MOCK_LAST_UPDATED = new Date("2026-02-10T10:45:00"); // ให้ตรงกับ UI "Last Updated"

// --- formatting helpers ---
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatShortDate(d: Date) {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function formatMonthYear(d: Date) {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// Allocate integers that sum exactly to `total` using smooth weights (deterministic)
function allocateByWeights(total: number, weights: number[]) {
  const sumW = weights.reduce((s, w) => s + w, 0) || 1;
  const raw = weights.map((w) => (w / sumW) * total);

  const floors = raw.map((x) => Math.floor(x));
  let remain = total - floors.reduce((s, x) => s + x, 0);

  // distribute remainder by largest fractional parts
  const fracOrder = raw
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac);

  const out = [...floors];
  for (let k = 0; k < fracOrder.length && remain > 0; k++) {
    out[fracOrder[k].i] += 1;
    remain -= 1;
  }
  return out;
}

function buildGrowthSeries(params: {
  labels: string[];
  endTotal: number;
  totalNew: number; // sum of newUsers across labels
}) {
  const { labels, endTotal, totalNew } = params;
  const points = labels.length;

  // Smooth wave weights so chart looks realistic (not random)
  const weights = Array.from({ length: points }, (_, i) => {
    const t = i / Math.max(1, points - 1);
    // bell-ish + wave: higher around middle, slightly trending up
    const bell = Math.exp(-Math.pow((t - 0.55) / 0.28, 2));
    const wave = 0.15 * Math.sin(i * 1.2) + 1;
    const trend = 0.9 + 0.25 * t;
    return Math.max(0.15, bell * wave * trend);
  });

  const newUsersArr = allocateByWeights(totalNew, weights);

  const startTotal = Math.max(0, endTotal - totalNew);
  let running = startTotal;

  return labels.map((label, idx) => {
    running += newUsersArr[idx];
    return {
      label,
      newUsers: newUsersArr[idx],
      totalUsers: running,
    };
  });
}

function getUserGrowthMockData(granularity: UserGranularity, endTotal: number) {
  if (granularity === "DAY") {
    const points = 14;
    const totalNew = 880;
    const labels = Array.from({ length: points }, (_, i) => {
      const d = new Date(MOCK_LAST_UPDATED);
      d.setDate(d.getDate() - (points - 1 - i));
      return formatShortDate(d);
    });
    return buildGrowthSeries({ labels, endTotal, totalNew });
  }

  if (granularity === "WEEK") {
    const points = 12;
    const totalNew = 4200; // 12 สัปดาห์ล่าสุดเพิ่มรวม 1,200
    const labels = Array.from({ length: points }, (_, i) => {
      const d = new Date(MOCK_LAST_UPDATED);
      d.setDate(d.getDate() - (points - 1 - i) * 7);
      return `Wk ${formatShortDate(d)}`;
    });
    return buildGrowthSeries({ labels, endTotal, totalNew });
  }

  if (granularity === "MONTH") {
    const points = 12;
    const totalNew = 8900; // 12 เดือนล่าสุดเพิ่มรวม 4,800
    const labels = Array.from({ length: points }, (_, i) => {
      const d = new Date(MOCK_LAST_UPDATED);
      d.setMonth(d.getMonth() - (points - 1 - i));
      return formatMonthYear(d);
    });
    return buildGrowthSeries({ labels, endTotal, totalNew });
  }

  // YEAR
  {
    const labels = ["2022", "2023", "2024", "2025", "2026"];
    const totalNew = endTotal;
    return buildGrowthSeries({ labels, endTotal, totalNew });
  }
}
export default function DashboardPage() {
  const [campaignFilter, setCampaignFilter] = useState<FilterType>("All");
  const [tierFilter, setTierFilter] = useState<FilterType>("All");
  const [chartTimeRange, setChartTimeRange] = useState<"3M" | "6M" | "1Y">(
    "6M",
  );
  const [animationKey, setAnimationKey] = useState(0);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-500",
          border: "border-red-500",
          text: "text-red-400",
          ring: "ring-red-500/20",
        };
      case "blue":
        return {
          bg: "bg-blue-500",
          border: "border-blue-500",
          text: "text-blue-400",
          ring: "ring-blue-500/20",
        };
      case "green":
        return {
          bg: "bg-green-500",
          border: "border-green-500",
          text: "text-green-400",
          ring: "ring-green-500/20",
        };
      default:
        return {
          bg: "bg-gray-500",
          border: "border-gray-500",
          text: "text-gray-400",
          ring: "ring-gray-500/20",
        };
    }
  };

  const filteredCampaigns =
    campaignFilter === "All"
      ? campaigns
      : campaigns.filter((c) => c.company === campaignFilter);
  const [userGrowthGranularity, setUserGrowthGranularity] =
    useState<UserGranularity>("DAY");

  const userGrowthData = useMemo(
    () =>
      getUserGrowthMockData(userGrowthGranularity, globalStats.totalMembers),
    [userGrowthGranularity],
  );

  const userGrowthSummary = useMemo(() => {
    const totalNew = userGrowthData.reduce((s, x) => s + x.newUsers, 0);
    const endTotal =
      userGrowthData[userGrowthData.length - 1]?.totalUsers ??
      globalStats.totalMembers;
    const startTotal = Math.max(0, endTotal - totalNew);
    const avg = totalNew / Math.max(1, userGrowthData.length);
    const pct = startTotal > 0 ? (totalNew / startTotal) * 100 : 0;

    return { totalNew, startTotal, endTotal, avg, pct };
  }, [userGrowthData]);
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <main className="px-12 py-6">
        <div className="mb-6 flex items-center justify-between pt-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Unified Control Tower
              </h1>
              <div className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5">
                <Shield className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-bold tracking-wide text-orange-600">
                  ADMIN
                </span>
              </div>
            </div>
            <p className="text-slate-600 mt-1.5 text-sm">
              หอควบคุมศูนย์กลาง - ภาพรวม TISCO Group
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Last Updated</div>
            <div className="text-sm font-semibold text-slate-700">
              Feb 10, 2026 - 10:45 AM
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">
            Global Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Total Members
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {formatNumber(globalStats.totalMembers)}
                  </p>
                  <p className="text-xs text-emerald-300 mt-1.5 font-medium">
                    Active {globalStats.activePercentage}%
                  </p>
                </div>
                <Users className="w-7 h-7 text-blue-500 shrink-0" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Total Points Value
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    ฿{formatNumber(globalStats.totalPointsValue)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">
                    Liability
                  </p>
                </div>
                <Coins className="w-7 h-7 text-blue-500 shrink-0" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Today's Transactions
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {formatNumber(globalStats.todayTransactions.total)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">
                    รายการทั้งหมด
                  </p>
                </div>
                <TrendingUp className="w-7 h-7 text-blue-500 shrink-0" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Earn / Burn
                  </p>
                  <div className="flex gap-3 items-center mt-1">
                    <span className="text-lg font-extrabold text-emerald-300">
                      ↓{formatNumber(globalStats.todayTransactions.earn)}
                    </span>
                    <span className="text-lg font-extrabold text-orange-300">
                      ↑{formatNumber(globalStats.todayTransactions.burn)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">
                    Today
                  </p>
                </div>
                <RefreshCw className="w-7 h-7 text-blue-500 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Critical Inventory Alert
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Reward Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {inventoryAlerts.map((item, index) => {
                    const colors = getColorClasses(item.color);
                    const isLowStock = item.status === "warning";
                    return (
                      <tr
                        key={index}
                        className={isLowStock ? "bg-orange-500/10" : ""}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-1 h-10 ${colors.bg} rounded`}
                            ></div>
                            <span
                              className={`font-semibold text-sm ${colors.text}`}
                            >
                              {item.company}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-700">
                            {item.rewardItem}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isLowStock ? (
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                              <span className="text-sm font-semibold text-orange-600">
                                Left: {item.current} / {item.total}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                              <span className="text-sm text-slate-500">
                                Left: {item.current} / {item.total}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isLowStock ? (
                            <button className="rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors">
                              Restock
                            </button>
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">
            User Signup Trend
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-md font-bold text-slate-800">
                  Registered Users (New + Cumulative)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ดูยอดสมัครใหม่และยอดสะสม ตามช่วงเวลา (วัน/สัปดาห์/เดือน/ปี)
                </p>
              </div>

              <div className="flex gap-2">
                {(["DAY", "WEEK", "MONTH", "YEAR"] as UserGranularity[]).map(
                  (g) => (
                    <button
                      key={g}
                      onClick={() => setUserGrowthGranularity(g)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                        userGrowthGranularity === g
                          ? "bg-slate-200 text-slate-900 border border-slate-300"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {g === "DAY"
                        ? "Day"
                        : g === "WEEK"
                          ? "Week"
                          : g === "MONTH"
                            ? "Month"
                            : "Year"}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  New Signups (Selected Range)
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900">
                  +{formatNumber(Math.round(userGrowthSummary.totalNew))}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Avg {formatNumber(Math.round(userGrowthSummary.avg))} /
                  interval • Growth {userGrowthSummary.pct.toFixed(1)}%
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Total Users (Start → End)
                </div>
                <div className="mt-1 text-xl font-extrabold text-slate-900">
                  {formatNumber(userGrowthSummary.startTotal)} →{" "}
                  {formatNumber(userGrowthSummary.endTotal)}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Ending total aligns with Global Total Members
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Health Signal
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm font-bold text-slate-700">
                    Signup trend is stable
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  (mock) สามารถต่อ API จริงภายหลังได้ทันที
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <ResponsiveContainer width="100%" height={520}>
              <LineChart data={userGrowthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.08)"
                />
                <XAxis dataKey="label" stroke="#64748b" />

                {/* LEFT AXIS: Total Users */}
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  tickFormatter={(v) => formatNumber(v)}
                  padding={{ top: 16, bottom: 16 }}
                />

                {/* RIGHT AXIS: New Users (ทำให้เส้นไม่ติดพื้น) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  tickFormatter={(v) => formatNumber(v)}
                  padding={{ top: 16, bottom: 16 }}
                  domain={[
                    (min: number) => {
                      // ดัน min ลงนิดนึง (แต่ไม่ต่ำกว่า 0) เพื่อให้เส้น "ลอย" ไม่ติดพื้น
                      const pad = Math.max(2, Math.ceil(min * 0.15));
                      return Math.max(0, min - pad);
                    },
                    (max: number) => {
                      const pad = Math.max(2, Math.ceil(max * 0.15));
                      return max + pad;
                    },
                  ]}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    color: "#334155",
                  }}
                  formatter={(value: unknown, name?: string) => {
                    const label =
                      name === "newUsers"
                        ? "New Signups"
                        : name === "totalUsers"
                          ? "Total Users"
                          : (name ?? "Value");

                    const v = typeof value === "number" ? value : Number(value);
                    return [Number.isFinite(v) ? formatNumber(v) : "-", label];
                  }}
                />

                <Legend wrapperStyle={{ color: "#334155" }} />

                {/* ผูก newUsers กับแกนขวา */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="newUsers"
                  name="New Signups"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />

                {/* ผูก totalUsers กับแกนซ้าย */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalUsers"
                  name="Total Users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">
            Analytics Overview
          </h2>

          {/* Donut Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Member Tier Distribution */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-slate-800">
                  Member Tier Distribution
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTierFilter("All");
                      setAnimationKey((prev) => prev + 1);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                      tierFilter === "All"
                        ? "bg-slate-200 text-slate-900 border border-slate-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setTierFilter("TISCO");
                      setAnimationKey((prev) => prev + 1);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                      tierFilter === "TISCO"
                        ? "bg-red-500/20 text-red-300 border border-red-400/30"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    TISCO
                  </button>
                  <button
                    onClick={() => {
                      setTierFilter("Bank");
                      setAnimationKey((prev) => prev + 1);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                      tierFilter === "Bank"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    Bank
                  </button>
                  <button
                    onClick={() => {
                      setTierFilter("Insure");
                      setAnimationKey((prev) => prev + 1);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                      tierFilter === "Insure"
                        ? "bg-green-500/20 text-green-300 border border-green-400/30"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    Insure
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart key={`tier-${tierFilter}-${animationKey}`}>
                  <Pie
                    data={
                      tierFilter === "All"
                        ? memberTierData
                        : memberTierByCompany[tierFilter]
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {(tierFilter === "All"
                      ? memberTierData
                      : memberTierByCompany[tierFilter]
                    ).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      color: "#334155",
                    }}
                    formatter={(value: number | undefined) =>
                      value ? formatNumber(value) : ""
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-xs text-slate-600">Platinum</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-xs text-slate-600">Gold</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                  <span className="text-xs text-slate-600">Silver</span>
                </div>
              </div>
            </div>

            {/* Point Liability */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-md font-bold text-slate-800 mb-4">
                Point Liability (Outstanding)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart key="point-liability">
                  <Pie
                    data={pointLiabilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) =>
                      `${name} ฿${formatNumber(value)}`
                    }
                  >
                    {pointLiabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      color: "#334155",
                    }}
                    formatter={(value: number | undefined) =>
                      value ? `฿${formatNumber(value)}` : ""
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-slate-600">TISCO</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-slate-600">Bank</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-slate-600">Insure</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Charts Section */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Monthly Earn vs Burn */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-slate-800">
                  Monthly Earn vs Burn
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartTimeRange("3M")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                      chartTimeRange === "3M"
                        ? "bg-slate-200 text-slate-900 border border-slate-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    3M
                  </button>
                  <button
                    onClick={() => setChartTimeRange("6M")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                      chartTimeRange === "6M"
                        ? "bg-slate-200 text-slate-900 border border-slate-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    6M
                  </button>
                  <button
                    onClick={() => setChartTimeRange("1Y")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                      chartTimeRange === "1Y"
                        ? "bg-slate-200 text-slate-900 border border-slate-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    1Y
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyEarnBurnData.slice(
                    chartTimeRange === "3M"
                      ? -3
                      : chartTimeRange === "6M"
                        ? -6
                        : 0,
                  )}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.08)"
                  />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      color: "#334155",
                    }}
                    formatter={(value: number | undefined) =>
                      value ? formatNumber(value) : ""
                    }
                  />
                  <Legend wrapperStyle={{ color: "#334155" }} />
                  <Bar
                    dataKey="earn"
                    fill="#22c55e"
                    name="Points Earned"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="burn"
                    fill="#f97316"
                    name="Points Burned"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top 5 Redemptions */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-md font-bold text-slate-800 mb-4">
                Top 5 Redemption Campaigns
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topRedemptionsData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.08)"
                  />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#64748b"
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      color: "#334155",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Points by Activity */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-md font-bold text-slate-800 mb-4">
                Points Earned by Activity
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={pointsByActivityData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.08)"
                  />
                  <XAxis dataKey="activity" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      color: "#334155",
                    }}
                    formatter={(value: number | undefined) =>
                      value ? formatNumber(value) : ""
                    }
                  />
                  <Bar dataKey="points" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stacked Bar Chart */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 mb-4">
              Monthly Transaction by Company (Stacked)
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={stackedMonthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.08)"
                />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis
                  stroke="#64748b"
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    color: "#334155",
                  }}
                  formatter={(value: number | undefined) =>
                    value ? formatNumber(value) : ""
                  }
                />
                <Legend wrapperStyle={{ color: "#334155" }} />
                <Bar
                  dataKey="TISCO"
                  stackId="a"
                  fill="#ef4444"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Bank"
                  stackId="a"
                  fill="#3b82f6"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Insure"
                  stackId="a"
                  fill="#22c55e"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">
            Campaign Performance Feed
          </h2>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setCampaignFilter("All")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                campaignFilter === "All"
                  ? "bg-slate-200 text-slate-900 border border-slate-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCampaignFilter("TISCO")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                campaignFilter === "TISCO"
                  ? "bg-red-500/20 text-red-300 border border-red-400/30 ring-1 ring-red-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              TISCO
            </button>
            <button
              onClick={() => setCampaignFilter("Bank")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                campaignFilter === "Bank"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-400/30 ring-1 ring-blue-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Bank
            </button>
            <button
              onClick={() => setCampaignFilter("Insure")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                campaignFilter === "Insure"
                  ? "bg-green-500/20 text-green-300 border border-green-400/30 ring-1 ring-green-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Insure
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Points Earned
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Points Used
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Rewards Used
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Privileges Used
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCampaigns.map((campaign, index) => {
                    const colors = getColorClasses(campaign.color);
                    return (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-1 h-12 ${colors.bg} rounded`}
                            ></div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`text-xs font-bold ${colors.text} uppercase tracking-wide`}
                                >
                                  [{campaign.company}]
                                </span>
                              </div>
                              <div className="text-sm font-bold text-slate-900">
                                {campaign.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-bold text-slate-600">
                              {campaign.participants}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-bold text-slate-600">
                              {formatNumber(campaign.pointsEarned)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-bold text-slate-600">
                              {formatNumber(campaign.pointsUsed)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-bold text-slate-600">
                              {campaign.rewardsUsed}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-bold text-slate-600">
                              {campaign.privilegesUsed}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <style>{`
          button { -webkit-tap-highlight-color: transparent; }
          input { -webkit-tap-highlight-color: transparent; }
        `}</style>
      </main>
    </div>
  );
}

"use client";

// 4.2 TISCO Bank - Earn / Burn Point Transactions (mock)
const bankEarnBurnTransactions = [
  { date: "2026-02-10", type: "Earn", points: 12500, description: "ฝากเงินฝากประจำ Super Rate" },
  { date: "2026-02-10", type: "Burn", points: 8000, description: "แลก Starbucks e-Voucher" },
  { date: "2026-02-09", type: "Earn", points: 3200, description: "โอนเงินเข้า Wealth Account" },
  { date: "2026-02-09", type: "Burn", points: 15000, description: "แลก Central Gift Voucher" },
  { date: "2026-02-08", type: "Earn", points: 5800, description: "ฝากเงินฝากประจำ 3 เดือน" },
  { date: "2026-02-08", type: "Earn", points: 2100, description: "ทำธุรกรรมออนไลน์" },
  { date: "2026-02-07", type: "Burn", points: 5000, description: "แลก Grab Voucher" },
];

// 4.3 TISCO Insure - Reward / Privilege Transactions (mock)
const insureRewardPrivilegeTransactions = [
  { date: "2026-02-10", type: "Reward", item: "Central Voucher 500฿", memberId: "M-8842", points: 500 },
  { date: "2026-02-10", type: "Privilege", item: "Lounge Access สนามบิน", memberId: "M-1203", points: "-" },
  { date: "2026-02-09", type: "Reward", item: "Starbucks e-Voucher", memberId: "M-5521", points: 120 },
  { date: "2026-02-09", type: "Reward", item: "กระเป๋าผ้า Limited", memberId: "M-9912", points: 350 },
  { date: "2026-02-08", type: "Privilege", item: "ความคุ้มครองเพิ่ม Dental", memberId: "M-3340", points: "-" },
  { date: "2026-02-08", type: "Reward", item: "Grab 100฿", memberId: "M-7788", points: 100 },
  { date: "2026-02-07", type: "Privilege", item: "ตรวจสุขภาพประจำปี", memberId: "M-2201", points: "-" },
];

export default function ReportPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <main className="px-12 py-6">
        <div className="mb-8 pt-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Report</h1>
          <p className="text-slate-600 mt-1.5 text-sm">รายงานธุรกรรมตาม Company</p>
        </div>

        {/* 4.2 TISCO Bank - Earn / Burn Point Transactions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Report Transaction : Earn / Burn Point Transactions</h2>
          <p className="text-sm text-slate-600 mb-4">แสดงข้อมูล Earn / Burn Transactions ที่เกิดขึ้นภายใต้ Company : TISCO Bank</p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Points</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {bankEarnBurnTransactions.map((row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-slate-600">{row.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${row.type === "Earn" ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-700"}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        {row.type === "Earn" ? "+" : "-"}{typeof row.points === "number" ? row.points.toLocaleString() : row.points}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4.3 TISCO Insure - Reward / Privilege Transactions */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Report Transaction : Reward / Privilege Transactions</h2>
          <p className="text-sm text-slate-600 mb-4">แสดงข้อมูล Reward / Privilege Transactions ที่เกิดขึ้นภายใต้ Company : TISCO Insure</p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Member ID</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {insureRewardPrivilegeTransactions.map((row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-slate-600">{row.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${row.type === "Reward" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.item}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{row.memberId}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

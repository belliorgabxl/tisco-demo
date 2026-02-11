"use client";

export default function SettingsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <main className="px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            System Settings
          </h1>
          <p className="text-slate-600 mt-1.5 text-sm">
            ตั้งค่าระบบและการกำหนดค่าต่างๆ
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-slate-600">Settings content coming soon...</p>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { LayoutDashboard, Megaphone, Users, Gift, Settings, Shield, ArrowRight } from "lucide-react";

export default function CMSWelcomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <main className="px-8 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 mb-6">
            <Shield className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-bold tracking-wide text-orange-600">Back Office</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Welcome to TISCO Loyalty CMS
          </h1>
          <p className="text-slate-600 text-lg mb-10">
            หอควบคุมศูนย์กลาง — จัดการแคมเปญ สิทธิประโยชน์ และรายงาน
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Link
              href="/cms/dashboard"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-sky-200 transition-all flex items-center gap-4"
            >
              <div className="rounded-xl bg-sky-50 p-3 ring-1 ring-sky-100">
                <LayoutDashboard className="w-8 h-8 text-sky-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-slate-900 group-hover:text-sky-700">Dashboard</h2>
                <p className="text-sm text-slate-500">ภาพรวมและสถิติ</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-sky-500" />
            </Link>
            <Link
              href="/cms/mg_campaigns"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex items-center gap-4"
            >
              <div className="rounded-xl bg-red-50 p-3 ring-1 ring-red-100">
                <Megaphone className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-slate-900 group-hover:text-red-700">Campaigns</h2>
                <p className="text-sm text-slate-500">จัดการแคมเปญ</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
            </Link>
      
          </div>

          <Link
            href="/cms/settings"
            className="inline-flex items-center gap-2 mt-8 text-slate-500 hover:text-slate-700 text-sm font-medium"
          >
            <Settings className="w-4 h-4" />
            System Settings
          </Link>
        </div>
      </main>
    </div>
  );
}

"use client";

import UserBanner from "@/components/common/banner";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronRight,
  ShieldCheck,
  Receipt,
  Wallet,
  TicketPercent,
  Gift,
  Settings,
  HelpCircle,
  LogOut,
  UserRound,
  Crown,
  Bell,
} from "lucide-react";
import ThemeBackground from "@/components/theme-background";
import { ACTIVE_POINT_TYPE_KEY, PointType } from "@/resource/constant";

export default function MePage() {
  const router = useRouter();

  const quickTiles = useMemo(
    () => [
      {
        title: "Wallet",
        desc: "ดูเครดิต / แต้ม",
        icon: <Wallet className="h-5 w-5" />,
        onClick: () => router.push("/wallet"),
      },
      {
        title: "History",
        desc: "รายการย้อนหลัง",
        icon: <Receipt className="h-5 w-5" />,
        onClick: () => router.push("/history"),
      },
      {
        title: "Coupons",
        desc: "คูปองของฉัน",
        icon: <TicketPercent className="h-5 w-5" />,
        onClick: () => router.push("/coupons"),
      },
      {
        title: "Rewards",
        desc: "แลกของรางวัล",
        icon: <Gift className="h-5 w-5" />,
        onClick: () => router.push("/rewards"),
      },
    ],
    [router],
  );

  const menu = useMemo(
    () => [
      {
        group: "Account",
        items: [
          {
            title: "My Profile",
            desc: "ข้อมูลส่วนตัว / การยืนยันตัวตน",
            icon: <UserRound className="h-5 w-5" />,
            onClick: () => router.push("/me/profile"),
          },
          {
            title: "Tier & Benefits",
            desc: "สิทธิ์ตามระดับสมาชิก",
            icon: <Crown className="h-5 w-5" />,
            onClick: () => router.push("/me/tier"),
          },
          {
            title: "Notifications",
            desc: "การแจ้งเตือน",
            icon: <Bell className="h-5 w-5" />,
            onClick: () => router.push("/me/notifications"),
          },
        ],
      },
      {
        group: "Security",
        items: [
          {
            title: "Privacy & Consent",
            desc: "การให้ความยินยอม / นโยบาย",
            icon: <ShieldCheck className="h-5 w-5" />,
            onClick: () => router.push("/me/privacy"),
          },
        ],
      },
      {
        group: "Settings",
        items: [
          {
            title: "App Settings",
            desc: "ภาษา / ธีม / การแสดงผล",
            icon: <Settings className="h-5 w-5" />,
            onClick: () => router.push("/me/settings"),
          },
          {
            title: "Help & Support",
            desc: "ศูนย์ช่วยเหลือ / ติดต่อเรา",
            icon: <HelpCircle className="h-5 w-5" />,
            onClick: () => router.push("/support"),
          },
        ],
      },
    ],
    [router],
  );

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.replace("/login");
    router.refresh();
  }
  const [activePointType, setActivePointType] = useState<PointType>("TISCO");
  useEffect(() => {
    const saved = sessionStorage.getItem(
      ACTIVE_POINT_TYPE_KEY,
    ) as PointType | null;
    if (saved) setActivePointType(saved);
  }, []);

  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center px-4 py-4 text-sky-50">
      {/* background */}
      <ThemeBackground type={activePointType} />

      <section className="w-full max-w-[520px] relative pb-28">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold tracking-tight text-white/95">
              Profile
            </div>
            <div className="text-xs text-white/65">
              จัดการโปรไฟล์ แต้ม สิทธิ์ และการตั้งค่า
            </div>
          </div>
        </div>

        {/* Banner (reuse เดิม) */}
        <div className="mt-4 relative z-50">
          <UserBanner
            meEndpoint="/api/auth/me"
            // onRedeem={() => router.push("/rewards")}
            onOpenNotifications={() => router.push("/me/notifications")}
            onAccountChange={(next) => {
              setActivePointType(next);
              router.refresh();
            }}
          />
        </div>

        {/* Quick tiles */}
        <div className="mt-6 z-0 grid grid-cols-2 gap-3">
          {quickTiles.map((t) => (
            <button
              key={t.title}
              type="button"
              onClick={t.onClick}
              className="group rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl
                shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
                hover:bg-white/15 active:scale-[0.995] transition"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 text-white/85">
                  {t.icon}
                </div>
                <ChevronRight className="h-5 w-5 text-white/65 group-hover:translate-x-0.5 transition" />
              </div>
              <div className="mt-3 text-sm font-bold text-white/90">
                {t.title}
              </div>
              <div className="mt-1 text-xs text-white/65">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Menu sections */}
        <div className="mt-6 space-y-4">
          {menu.map((g) => (
            <div
              key={g.group}
              className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl
                shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <div className="px-4 pt-4 text-xs font-semibold text-white/70">
                {g.group}
              </div>

              <div className="mt-2 divide-y divide-white/10">
                {g.items.map((it) => (
                  <button
                    key={it.title}
                    type="button"
                    onClick={it.onClick}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 text-white/85">
                        {it.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-white/90 truncate">
                          {it.title}
                        </div>
                        <div className="text-xs text-white/60 truncate">
                          {it.desc}
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-white/60" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-6">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-3xl border border-white/15 bg-red-500/10 px-4 py-3 text-left backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]
              hover:bg-white/15 active:scale-[0.995] transition"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/15 ring-1 ring-rose-400/25 text-rose-100">
                <LogOut className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-white/90">Logout</div>
                <div className="text-xs text-white/60">
                  ออกจากระบบในอุปกรณ์นี้
                </div>
              </div>
              {/* <ChevronRight className="h-5 w-5 text-white/60" /> */}
            </div>
          </button>
        </div>

        <style>{`button{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

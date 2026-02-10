"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Gift,
  Receipt,
  Settings,
  LogOut,
  Shield,
  TrendingUp,
  Boxes,
  Star,
  ChevronDown,
  Package,
  BarChart,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    description: "ภาพรวมและสถิติ",
  },
  {
    name: "Campaigns",
    icon: Megaphone,
    path: "/campaigns",
    description: "จัดการแคมเปญ",
  },
  {
    name: "Members",
    icon: Users,
    path: "/members",
    description: "จัดการสมาชิก",
  },
  {
    name: "Benefits Management",
    icon: Package,
    path: null,
    description: "จัดการสิทธิประโยชน์",
    submenu: [
      {
        name: "Rewards",
        icon: Gift,
        path: "/rewards",
        description: "จัดการของรางวัล",
      },
      {
        name: "Inventory",
        icon: Boxes,
        path: "/inventory",
        description: "สต็อกสินค้า",
      },
      {
        name: "Privileges",
        icon: Star,
        path: "/privileges",
        description: "สิทธิพิเศษ",
      },
    ],
  },
  {
    name: "Report",
    icon: BarChart,
    path: null,
    description: "รายงานและวิเคราะห์",
    submenu: [
      {
        name: "Transactions",
        icon: Receipt,
        path: "/transactions",
        description: "รายการทั้งหมด",
      },
      {
        name: "Analytics",
        icon: TrendingUp,
        path: "/analytics",
        description: "วิเคราะห์ข้อมูล",
      },
    ],
  },
];

export default function BackOfficeNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    router.push("/cms-login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div
        aria-hidden
        className="absolute inset-0 -z-10
        bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(88,197,255,0.28),transparent_55%),radial-gradient(900px_500px_at_90%_25%,rgba(45,110,255,0.22),transparent_58%),linear-gradient(180deg,#07162F_0%,#061225_55%,#040A14_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10
        [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]
        [background-size:28px_28px]
        [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -top-44 -left-40 -z-10 h-[520px] w-[520px] blur-[2px]
        bg-[radial-gradient(circle_at_30%_30%,rgba(88,197,255,0.30),transparent_60%)]"
      />
      <div
        aria-hidden
        className="absolute -bottom-56 -right-48 -z-10 h-[560px] w-[560px] blur-[2px]
        bg-[radial-gradient(circle_at_60%_60%,rgba(45,110,255,0.26),transparent_62%)]"
      />

      <div className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-white/15">
                <Image
                  src="/logo/tisco-logo.png"
                  width={40}
                  height={40}
                  alt="TISCO Logo"
                  className="h-10 w-10"
                />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white/95">
                  TISCO Loyalty
                </h1>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-orange-400" />
                  <p className="text-xs font-bold text-orange-300">Back Office</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => {
                const isActive = item.path ? pathname === item.path : item.submenu?.some(sub => pathname === sub.path);
                const Icon = item.icon;

                if (item.submenu) {
                  return (
                    <div key={item.name} className="relative" onMouseLeave={() => {
  setDropdownTimeout(setTimeout(() => setOpenDropdown(null), 200));
}} onMouseEnter={() => {
  if (dropdownTimeout) clearTimeout(dropdownTimeout);
  setOpenDropdown(item.name);
}}>
                      <button
                        className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:scale-105 ${
                          isActive
                            ? "bg-white/15 text-white border border-white/20 shadow-lg"
                            : "text-white/70 hover:bg-white/10 hover:text-white border border-transparent hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`rounded-lg p-1 transition-all duration-300 ease-out ${
                            isActive
                              ? "bg-sky-500/20 ring-1 ring-sky-400/30"
                              : "bg-white/5 group-hover:bg-white/10 group-hover:scale-110"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold">{item.name}</span>
                        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ease-out ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>

              
                      {openDropdown === item.name && (
                        <div className="absolute top-full mt-2 w-56 rounded-xl border border-white/20 bg-white/15 backdrop-blur-2xl shadow-[0_14px_30px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 z-10">
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = pathname === subItem.path;

                            return (
                              <button
                                key={subItem.path}
                                onClick={() => {
                                  router.push(subItem.path);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ease-out hover:scale-[1.02] ${
                                  isSubActive
                                    ? "bg-white/15 text-white border-l-2 border-sky-400"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                <SubIcon className="h-4 w-4" />
                                <div className="text-left">
                                  <span className="text-sm font-bold">{subItem.name}</span>
                                  <p className="text-xs text-white/50">{subItem.description}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:scale-105 ${
                      isActive
                        ? "bg-white/15 text-white border border-white/20 shadow-lg"
                        : "text-white/70 hover:bg-white/10 hover:text-white border border-transparent hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-1 transition-all duration-300 ease-out ${
                        isActive
                          ? "bg-sky-500/20 ring-1 ring-sky-400/30"
                          : "bg-white/5 group-hover:bg-white/10 group-hover:scale-110"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 ease-out hover:scale-105 border border-transparent"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">AD</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-white/95">Admin User</p>
                  <p className="text-xs text-white/60">Super Admin</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

         
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/20 bg-white/15 backdrop-blur-2xl shadow-[0_14px_30px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-bold text-white/95">Admin User</p>
                    <p className="text-xs text-white/60">Super Admin</p>
                  </div>
                  <button
                    onClick={() => router.push("/settings")}
                    className="w-full flex items-center gap-3 px-3 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm font-bold">Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 text-white/70 hover:bg-red-500/10 hover:text-red-300 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-bold">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:hidden border-t border-white/10">
          <div className="px-4 py-2">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {menuItems.map((item) => {
                const isActive = item.path ? pathname === item.path : item.submenu?.some(sub => pathname === sub.path);
                const Icon = item.icon;

                if (item.submenu) {
                  return (
                    <div key={item.name} className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                        className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ease-out hover:scale-105 ${
                          isActive
                            ? "bg-white/15 text-white border border-white/20"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-bold">{item.name}</span>
                        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ease-out ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>

       
                      {openDropdown === item.name && (
                        <div className="absolute top-full mt-1 left-0 w-48 rounded-lg border border-white/20 bg-white/15 backdrop-blur-2xl shadow-lg overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = pathname === subItem.path;

                            return (
                              <button
                                key={subItem.path}
                                onClick={() => {
                                  router.push(subItem.path);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 transition-all duration-200 ease-out hover:scale-[1.02] ${
                                  isSubActive
                                    ? "bg-white/15 text-white border-l-2 border-sky-400"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                <SubIcon className="h-4 w-4" />
                                <span className="text-xs font-bold">{subItem.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ease-out hover:scale-105 ${
                      isActive
                        ? "bg-white/15 text-white border border-white/20"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-bold">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {(showUserMenu || openDropdown) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => {
            setShowUserMenu(false);
            setOpenDropdown(null);
          }}
        />
      )}
    </nav>
  );
}
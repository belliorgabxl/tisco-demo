"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, Settings, LogOut, Shield, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function BackOfficeNavbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    router.push("/cms-login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-[#07162F]">
      <div className="relative z-50 border-b border-white/10 shadow-sm">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {onMenuClick && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMenuClick();
                  }}
                  className="relative z-50 rounded-xl p-2.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  aria-label="เปิดเมนู"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
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
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/20 bg-gray-700/50 backdrop-blur-2xl shadow-[0_14px_30px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-bold text-white/95">Admin User</p>
                    <p className="text-xs text-white/60">Super Admin</p>
                  </div>
                  <button
                    onClick={() => router.push("/cms/settings")}
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

      </div>

      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
          aria-hidden
        />
      )}
    </nav>
  );
}
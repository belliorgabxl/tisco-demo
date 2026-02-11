"use client";

import {
  Home as HomeIcon,
  Wallet,
  Receipt,
  UserRound,
  QrCode,
  ScanQrCode,
} from "lucide-react";
import { NavItem } from "./nav-items";
import { NavKey } from "@/resource/constant";

export default function Navbar({
  activeNav,
  onChange,
}: {
  activeNav: NavKey;
  onChange: (key: NavKey) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[520px] px-4 pb-4">
      <div
        className="relative rounded-3xl border border-white/15 bg-white/15 px-2 py-2 backdrop-blur-xl
          shadow-[0_18px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <div className="grid grid-cols-5 items-center">
          <NavItem
            active={activeNav === "home"}
            label="Home"
            icon={<HomeIcon className="h-5 w-5" />}
            onClick={() => onChange("home")}
          />

          <NavItem
            active={activeNav === "wallet"}
            label="Wallet"
            icon={<Wallet className="h-5 w-5" />}
            onClick={() => onChange("wallet")}
          />

          {/* Center QR button (bigger & different) */}
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange("qr" as NavKey)}
              className="group -mt-2 h-14 w-14 rounded-full
                bg-white text-gray-900
                shadow-[0_18px_38px_rgba(45,110,255,0.22),0_8px_18px_rgba(88,197,255,0.12)]
                ring-1 ring-white/20
                hover:-translate-y-0.5 active:scale-[0.98] transition"
              aria-label="QR"
            >
              <div className="flex items-center justify-center">
                <ScanQrCode className="h-8 w-8" />
              </div>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition
                  shadow-[0_0_0_8px_rgba(88,197,255,0.10)]"
              />
            </button>
          </div>

          <NavItem
            active={activeNav === "history"}
            label="History"
            icon={<Receipt className="h-5 w-5" />}
            onClick={() => onChange("history")}
          />

          <NavItem
            active={activeNav === "profile"}
            label="Me"
            icon={<UserRound className="h-5 w-5" />}
            onClick={() => onChange("profile")}
          />
        </div>
      </div>
    </div>
  );
}

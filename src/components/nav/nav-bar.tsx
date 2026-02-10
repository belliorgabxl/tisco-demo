"use client";

import React from "react";
import { Home as HomeIcon, Gift, Wallet, Receipt, UserRound } from "lucide-react";
import { NavItem } from "./nav-items";

export type NavKey = "home" | "rewards" | "wallet" | "history" | "profile";

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
        className="rounded-3xl border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-xl
          shadow-[0_18px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <div className="grid grid-cols-5">
          <NavItem
            active={activeNav === "home"}
            label="Home"
            icon={<HomeIcon className="h-5 w-5" />}
            onClick={() => onChange("home")}
          />
          <NavItem
            active={activeNav === "rewards"}
            label="Rewards"
            icon={<Gift className="h-5 w-5" />}
            onClick={() => onChange("rewards")}
          />
          <NavItem
            active={activeNav === "wallet"}
            label="Wallet"
            icon={<Wallet className="h-5 w-5" />}
            onClick={() => onChange("wallet")}
          />
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

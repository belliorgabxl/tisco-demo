"use client";

import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/nav/nav-bar";
import type { NavKey } from "@/resource/constant";

function pathToNavKey(path: string): NavKey {
  if (path.startsWith("/main/rewards")) return "rewards";
  if (path.startsWith("/main/wallet")) return "wallet";
  if (path.startsWith("/main/history")) return "history";
  if (path.startsWith("/main/profile")) return "profile";
  if (path.startsWith("/main/home")) return "home";
  return "home";
}

function navKeyToPath(key: NavKey): string {
  switch (key) {
    case "rewards":
      return "/main/rewards";
    case "home":
      return "/main/home";
    case "wallet":
      return "/main/wallet";
    case "history":
      return "/main/history";
    case "profile":
      return "/main/profile";
    case "myqr":
      return "/main/myqr";
    default:
      return "/main/home";
  }
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const showNavbar =
    pathname === "/main" || pathname.startsWith("/main/"); 

  const activeNav = pathToNavKey(pathname);

  return (
    <div className="min-h-dvh">
      <div className={showNavbar ? "" : ""}>{children}</div>

      {showNavbar && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <Navbar
            activeNav={activeNav}
            onChange={(key) => router.push(navKeyToPath(key))}
          />
        </div>
      )}
    </div>
  );
}

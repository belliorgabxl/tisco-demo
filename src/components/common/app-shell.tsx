"use client";

import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/nav/nav-bar";
import type { NavKey } from "@/resource/constant";

function pathToNavKey(path: string): NavKey {
  if (path.startsWith("/rewards")) return "rewards";
  if (path.startsWith("/wallet")) return "wallet";
  if (path.startsWith("/history")) return "history";
  return "home";
}

function navKeyToPath(key: NavKey): string {
  switch (key) {
    case "rewards":
      return "/rewards";
    case "wallet":
      return "/wallet";
    case "history":
      return "/history";
    default:
      return "/home";
  }
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeNav = pathToNavKey(pathname);

  const hideNavbar = ["/", "/login", "/register"].includes(pathname);

  return (
    <div className="min-h-dvh">
      <div className={hideNavbar ? "" : ""}>{children}</div>

      {!hideNavbar && (
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

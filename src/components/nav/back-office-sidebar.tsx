"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, FileText, Settings, Home } from "lucide-react";

const navItems = [
  { href: "/cms", label: "Welcome", icon: Home },
  { href: "/cms/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cms/mg_campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/cms/report", label: "Report", icon: FileText },
  { href: "/cms/settings", label: "Settings", icon: Settings },
];

export default function BackOfficeSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay: อยู่ใต้ navbar (top-16) เพื่อไม่บล็อกปุ่มแฮมเบอร์เกอร์ */}
      {open && (
        <div
          className="fixed top-16 left-0 right-0 bottom-0 z-20 bg-black/40 md:bg-transparent md:pointer-events-none"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64
          bg-[#07162F] border-r border-white/10
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: "linear-gradient(180deg, #07162F 0%, #061225 55%, #040A14 100%)",
        }}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/cms" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors
                  ${isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

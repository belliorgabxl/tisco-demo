"use client";

import { useState } from "react";
import BackOfficeNavbar from "../../components/nav/back-office-navbar";
import BackOfficeSidebar from "../../components/nav/back-office-sidebar";

export default function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[#07162F]">
      <BackOfficeNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <BackOfficeSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 overflow-auto bg-white">
        {children}
      </main>
    </div>
  );
}

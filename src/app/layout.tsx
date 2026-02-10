import type { Metadata } from "next";
import "./globals.css";
import { Prompt } from "next/font/google";
import AppShell from "@/components/common/app-shell";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Tisco Loyalty Program",
    template: "%s | Tisco Loyalty",
  },
  description: "",
  icons: {
    icon: "/logo/tisco-logo.png",
    apple: "/logo/tisco-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${prompt.className} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

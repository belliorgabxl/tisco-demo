import type { Metadata } from "next";
import "./globals.css";
import { Prompt } from "next/font/google";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Tisco Loyalty Program",
    template: "%s | Tisco Loyalty",
  },
  description:
    "",

  icons: {
    icon: "/logo/tisco-logo.png",    
    // shortcut: "/icon-web.ico",      
    apple: "/logo/tisco-logo.png",     
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${prompt.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

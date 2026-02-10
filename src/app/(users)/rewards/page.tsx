"use client";

import UserBanner from "@/components/common/banner";
import { PointType } from "@/resource/constant";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [activePointType, setActivePointType] = useState<PointType>("TISCO");
  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center px-4 py-4 text-sky-50">
      <div
        aria-hidden
        className="absolute inset-0 -z-10
        bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(88,197,255,0.28),transparent_55%),radial-gradient(900px_500px_at_90%_25%,rgba(45,110,255,0.22),transparent_58%),linear-gradient(180deg,#07162F_0%,#061225_55%,#040A14_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-45
        [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)]
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
      <section className="w-full max-w-[520px] relative pb-28">
        <UserBanner
          meEndpoint="/api/auth/me"
          onRedeem={() => console.log("redeem")}
          onOpenNotifications={() => console.log("open notifications")}
          onAccountChange={(next) => {
            setActivePointType(next); 
            router.refresh(); 
          }}
        />

        <style>{`button{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

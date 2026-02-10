import { ArrowRight, UsersRound } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden flex justify-center px-4 py-6 text-sky-50">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(88,197,255,0.28),transparent_55%),radial-gradient(900px_500px_at_90%_25%,rgba(45,110,255,0.22),transparent_58%),linear-gradient(180deg,#07162F_0%,#061225_55%,#040A14_100%)]"
      />
      {/* Grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-45
        [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]
        [background-size:28px_28px]
        [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_70%)]"
      />
      {/* Glows */}
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

      {/* Content */}
      <section className="w-full max-w-[420px] relative min-h-screen flex flex-col pt-2">
        {/* Brand badge */}
        <div className="flex items-center justify-center gap-3">
          <div
            className="relative flex justify-center items-center h-14 w-14 overflow-hidden rounded-2xl bg-white
          "
          >
            {/* border border-white/15 bg-white/10 shadow-[0_14px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.10)]"> */}
            {/* <div className="absolute inset-0 bg-[radial-gradient(20px_20px_at_30%_30%,rgba(88,197,255,0.70),transparent_60%),linear-gradient(135deg,rgba(45,110,255,0.65),rgba(88,197,255,0.18))]" />
            <div
              className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full border border-white/20 shadow-[0_10px_24px_rgba(214,40,40,0.35)]
              bg-[radial-gradient(circle_at_30%_30%,#FF6B6B,#D62828)]"
            /> */}
            <Image
              src="/logo/tisco-logo.png"
              width={100}
              height={100}
              alt="tisco-logo.png"
              className="h-14 w-14"
            />
          </div>

          <div className="text-center">
            <div className="text-sm font-extrabold tracking-wide text-white/95">
              Tisco Demo
            </div>
            <div className="text-xs text-white/70">Mobile-App Loyalty</div>
          </div>
        </div>

        {/* Hero */}
        <div className="my-20 text-center">
          <h1 className="text-[34px] leading-[1.08] font-extrabold tracking-[-0.6px]">
            Welcome to <br />
            <span className="bg-gradient-to-r from-sky-300 via-blue-500 to-rose-400 bg-clip-text text-transparent">
              Tisco Demo App
            </span>
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-white/80">
            A precise and reliable Loyalty program—built for mobile. Simple to
            use, fast to navigate, and designed for a smooth member experience.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 grid gap-3">
          <a
            href="/register"
            className="group h-13 rounded-2xl font-bold tracking-wide
              flex items-center justify-center text-white
              bg-gradient-to-br from-sky-300 to-blue-600
              shadow-[0_18px_38px_rgba(45,110,255,0.35),0_8px_18px_rgba(88,197,255,0.18)]
              
              active:scale-[0.99] hover:-translate-y-pxtransition"
          >
            สมัครสมาชิก
            <span className="ml-2 text-lg opacity-90 transition group-hover:translate-x-0.5">
              <ArrowRight className="h-5 w-5 text-white" />
            </span>
          </a>

          <a
            href="/login"
            className="h-13 rounded-2xl font-bold tracking-wide
              flex items-center justify-center
              bg-white/5 border border-white/15 text-sky-50
              shadow-[0_14px_30px_rgba(0,0,0,0.25)]
              active:scale-[0.99] hover:-translate-y-px transition"
          >
            เข้าสู่ระบบ
            <span className="ml-2 text-lg opacity-90">
              <UsersRound className="h-5 w-5 text-sky-200" />
            </span>
          </a>
        </div>

        {/* Feature chips */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <div className="rounded-full px-3 py-2 text-xs bg-white/5 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-white/90">
            🔒 Secure
          </div>
          <div className="rounded-full px-3 py-2 text-xs bg-white/5 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-white/90">
            ⚡ Fast
          </div>
          <div className="rounded-full px-3 py-2 text-xs bg-white/5 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-white/90">
            📱 Mobile-first
          </div>
        </div>

        {/* Footer (push to bottom) */}
        <div className="mt-auto pb-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <p className="mt-3 text-center text-xs leading-relaxed text-white/60">
            This is a demo landing page. Continue to register or login to
            explore member flow.
          </p>
        </div>
      </section>

      {/* remove tap highlight */}
      <style>{`a{-webkit-tap-highlight-color:transparent;}`}</style>
    </main>
  );
}

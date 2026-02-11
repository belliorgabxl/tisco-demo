"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = username.trim().length >= 3 && password.length >= 6;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!canSubmit) {
      setMsg("กรุณากรอก Username และ Password ให้ครบถ้วน");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || "Login failed");
        return;
      }

      router.push("/main/home");
    } catch {
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none " +
    "focus:border-sky-300/50 focus:ring-2 focus:ring-sky-300/20 transition";

  return (
    <main className="relative min-h-screen overflow-hidden flex justify-center px-4 py-6 text-sky-50">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(88,197,255,0.28),transparent_55%),radial-gradient(900px_500px_at_90%_25%,rgba(45,110,255,0.22),transparent_58%),linear-gradient(180deg,#07162F_0%,#061225_55%,#040A14_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-45
        [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]
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

      {/* Content */}
      <section className="w-full max-w-[420px] relative min-h-screen flex flex-col pt-2">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 shadow-[0_10px_24px_rgba(0,0,0,0.25)] active:scale-[0.99] transition"
          >
            <ArrowLeft className="h-5 w-5" />
            กลับหน้าแรก
          </a>

          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400/90 shadow-[0_0_0_6px_rgba(244,63,94,0.12)]" />
            <span className="text-xs font-bold tracking-wide text-white/80">
              MEMBER LOGIN
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="mt-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-[0_14px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.10)]">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white">
              <Image
                src="/logo/tisco-logo.png"
                width={100}
                height={100}
                alt="tisco-logo.png"
                className="h-16 w-16"
              />
            </div>
          </div>

          <h1 className="text-[30px] leading-[1.1] font-extrabold tracking-[-0.6px]">
            เข้าสู่ระบบ <br />
            <span className="bg-gradient-to-r from-sky-300 via-blue-500 to-rose-400 bg-clip-text text-transparent">
              Tisco Loyalty
            </span>
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-white/75">
            เข้าสู่ระบบเพื่อจัดการสิทธิประโยชน์และข้อมูลสมาชิกอย่างแม่นยำและเสถียร
          </p>
        </div>

        {/* Form card */}
        <div className="mt-6 rounded-3xl border border-white/12 bg-white/[0.06] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur">
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-extrabold text-white/90">
                  ข้อมูลเข้าสู่ระบบ
                </div>
                <div className="text-[11px] text-white/45">* จำเป็น</div>
              </div>

              <div className="grid gap-3">
                <label className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide text-white/70">
                      Username <span className="text-rose-300">*</span>
                    </span>
                  </div>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                    <input
                      className={`${inputBase} pl-11`}
                      placeholder="เช่น gabel_01"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                </label>

                <label className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide text-white/70">
                      Password <span className="text-rose-300">*</span>
                    </span>
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                    <input
                      className={`${inputBase} pl-11`}
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="group h-[52px] rounded-2xl font-extrabold tracking-wide
                flex items-center justify-center text-white
                bg-gradient-to-br from-sky-300 to-blue-600
                shadow-[0_18px_38px_rgba(45,110,255,0.35),0_8px_18px_rgba(88,197,255,0.18)]
                border border-white/10
                disabled:opacity-60 disabled:cursor-not-allowed
                active:scale-[0.99] hover:-translate-y-[1px] transition"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                <>
                  เข้าสู่ระบบ
                  <span className="ml-2 text-lg opacity-90 transition group-hover:translate-x-0.5">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </>
              )}
            </button>

            {/* Message */}
            {msg ? (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                  msg.toLowerCase().includes("success")
                    ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-50"
                    : "border-rose-300/20 bg-rose-400/10 text-rose-50"
                }`}
              >
                {msg}
              </div>
            ) : null}

            {/* Bottom link */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">ยังไม่มีบัญชี?</span>
              <a
                href="/register"
                className="font-extrabold flex gap-2 items-center text-sky-200 hover:text-sky-100 transition"
              >
                ไปหน้าสมัครสมาชิก
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </form>
        </div>

        {/* Footer push */}
        <div className="mt-auto pb-6 pt-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <p className="mt-3 text-center text-xs leading-relaxed text-white/60">
            Demo login — for prototype member flow only.
          </p>
        </div>
      </section>

      <style>{`a{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
    </main>
  );
}

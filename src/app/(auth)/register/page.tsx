"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Field } from "@/components/common/field";
import { inputBase } from "@/resource/constant";
import PolicyModal from "@/components/common/policy-modal";
import { useRouter } from "next/navigation";

function calcAge(dateStr: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",

    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",

    nationality: "",
    religion: "",

    nationalId: "",
    passportNumber: "",

    consentAccepted: false,
    policyVersion: "v1",
  });
  const [openPolicy, setOpenPolicy] = useState(false);

  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const age = useMemo(() => calcAge(form.dateOfBirth), [form.dateOfBirth]);

  const canSubmit = useMemo(() => {
    const requiredOk =
      form.username.trim().length >= 3 &&
      form.password.length >= 6 &&
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.dateOfBirth.trim().length > 0 &&
      form.consentAccepted;

    const idOk =
      form.nationalId.trim() !== "" || form.passportNumber.trim() !== "";

    return requiredOk && idOk;
  }, [form]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (!canSubmit) {
      setMsg("กรุณากรอกข้อมูลที่จำเป็นและยืนยันการยินยอมก่อน");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || "Register failed");
        return;
      }

      setMsg("สมัครสมาชิกสำเร็จ 🎉 กำลังพากลับหน้าแรก...");

      setForm((prev) => ({
        ...prev,
        password: "",
        consentAccepted: false,
      }));
      setTimeout(() => router.push("/"), 600);
    } catch {
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
      <section className="w-full max-w-105 relative min-h-screen flex flex-col pt-2">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 shadow-[0_10px_24px_rgba(0,0,0,0.25)] active:scale-[0.99] transition"
          >
            <span className="text-base">
              <ArrowLeft className="text-white h-5 w-5" />
            </span>
            กลับหน้าแรก
          </a>

          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400/90 shadow-[0_0_0_6px_rgba(244,63,94,0.12)]" />
            <span className="text-xs font-bold tracking-wide text-white/80">
              ROYALTY MEMBER
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="mt-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-[0_14px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.10)]">
            <div
              className="relative flex justify-center items-center h-16 w-16
               overflow-hidden rounded-2xl bg-white
                    "
            >
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
            สมัครสมาชิก <br />
            <span className="bg-gradient-to-r from-sky-300 via-blue-500 to-rose-400 bg-clip-text text-transparent">
              Tisco Royalty
            </span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            กรอกข้อมูลสมาชิกเพื่อใช้งานสิทธิประโยชน์ได้อย่างแม่นยำ
            <br />
            เสถียรและใช้งานง่าย
          </p>
        </div>

        {/* Form card */}
        <div className="mt-6 rounded-3xl border border-white/12 bg-white/[0.06] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur">
          <form onSubmit={onSubmit} className="grid gap-4">
            {/* Account */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-extrabold text-white/90">
                  ข้อมูลบัญชี
                </div>
                <div className="text-[11px] text-white/45">* จำเป็น</div>
              </div>

              <div className="grid gap-3">
                <Field label="Username" required hint="อย่างน้อย 3 ตัวอักษร">
                  <input
                    className={inputBase}
                    placeholder="เช่น gabel_01"
                    value={form.username}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, username: e.target.value }))
                    }
                    autoComplete="username"
                  />
                </Field>

                <Field label="Password" required hint="อย่างน้อย 6 ตัวอักษร">
                  <input
                    className={inputBase}
                    placeholder="••••••••"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
                    autoComplete="new-password"
                  />
                </Field>
              </div>
            </div>

            {/* Personal */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="mb-3 text-sm font-extrabold text-white/90">
                ข้อมูลส่วนตัว
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="ชื่อจริง" required>
                  <input
                    className={inputBase}
                    placeholder="ชื่อ"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, firstName: e.target.value }))
                    }
                  />
                </Field>

                <Field label="นามสกุล" required>
                  <input
                    className={inputBase}
                    placeholder="นามสกุล"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, lastName: e.target.value }))
                    }
                  />
                </Field>
              </div>

              <div className="mt-3 grid gap-3">
                <Field label="อีเมล" required>
                  <input
                    className={inputBase}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    inputMode="email"
                    autoComplete="email"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="วันเกิด" required>
                    <input
                      className={inputBase}
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, dateOfBirth: e.target.value }))
                      }
                    />
                  </Field>

                  <Field label="อายุ" hint="คำนวณอัตโนมัติ">
                    <div className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 flex items-center text-sm text-white/80">
                      {age === null ? "-" : `${age} ปี`}
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="สัญชาติ" hint="เลือกได้">
                    <input
                      className={inputBase}
                      placeholder="เช่น Thai"
                      value={form.nationality}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, nationality: e.target.value }))
                      }
                    />
                  </Field>

                  <Field label="ศาสนา" hint="เลือกได้">
                    <input
                      className={inputBase}
                      placeholder="เช่น Buddhism"
                      value={form.religion}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, religion: e.target.value }))
                      }
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Identity (demo) */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="mb-1 flex items-center justify-between">
                <div className="text-sm font-extrabold text-white/90">
                  เอกสารยืนยันตัวตน (Demo)
                </div>
                <span className="text-[11px] text-white/45">ไม่จำเป็น</span>
              </div>
              <p className="text-[12px] leading-relaxed text-white/55">
                ในระบบจริงจะมีการกำกับสิทธิ์/การเข้ารหัส/เหตุผลการเก็บข้อมูลตามนโยบาย
              </p>
              {form.nationalId.trim() === "" &&
              form.passportNumber.trim() === "" ? (
                <div className="mt-3 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-50">
                  กรุณากรอก <b>เลขบัตรประชาชน</b> หรือ <b>Passport Number</b>{" "}
                  อย่างใดอย่างหนึ่ง
                </div>
              ) : null}
              <div className="mt-3 grid gap-3">
                <Field label="เลขบัตรประชาชน" hint="optional">
                  <input
                    className={inputBase}
                    placeholder="x-xxxx-xxxxx-xx-x"
                    value={form.nationalId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, nationalId: e.target.value }))
                    }
                  />
                </Field>

                <Field label="Passport Number" hint="optional">
                  <input
                    className={inputBase}
                    placeholder="เช่น AA1234567"
                    value={form.passportNumber}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, passportNumber: e.target.value }))
                    }
                  />
                </Field>
              </div>
            </div>

            {/* Consent */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-sm font-extrabold text-white/90">
                การยินยอม
              </div>

              <div className="mt-3 flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 rounded border-white/20 bg-white/10 accent-sky-400"
                  checked={form.consentAccepted}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      consentAccepted: e.target.checked,
                    }))
                  }
                />
                <div className="text-sm text-white/75 leading-relaxed">
                  ฉันได้อ่านและยินยอมตาม{" "}
                  <button
                    type="button"
                    onClick={() => setOpenPolicy(true)}
                    className="font-extrabold text-sky-200 hover:text-sky-100 underline underline-offset-4"
                  >
                    Privacy Policy / Terms
                  </button>
                  แล้ว
                  <div className="mt-1 text-[12px] text-white/45">
                    (เวอร์ชันนโยบาย: {form.policyVersion})
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="group h-[52px] rounded-2xl font-extrabold tracking-wide
                flex items-center justify-center text-white
                bg-gradient-to-br from-sky-300 to-blue-600
              
       
                disabled:opacity-60 disabled:cursor-not-allowed
                active:scale-[0.99] hover:-translate-y-[1px] transition"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  กำลังสมัครสมาชิก...
                </span>
              ) : (
                <>
                  สมัครสมาชิก
                  <span className="ml-2 text-lg opacity-90 transition group-hover:translate-x-0.5">
                    <ArrowRight className="text-white h-5 w-5" />
                  </span>
                </>
              )}
            </button>

            {/* Message */}
            {msg ? (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                  msg.includes("สำเร็จ")
                    ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-50"
                    : "border-rose-300/20 bg-rose-400/10 text-rose-50"
                }`}
              >
                {msg}
              </div>
            ) : null}

            {/* Bottom link */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">มีบัญชีอยู่แล้ว?</span>
              <a
                href="/login"
                className="font-extrabold flex gap-2 items-center text-sky-200 hover:text-sky-100 transition"
              >
                ไปหน้าเข้าสู่ระบบ
                <span>
                  {/* <ArrowRight className="text-white h-5 w-5" /> */}
                </span>
              </a>
            </div>
          </form>
        </div>

        {/* Footer push */}
        <div className="mt-auto pb-6 pt-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <p className="mt-3 text-center text-xs leading-relaxed text-white/60">
            ข้อมูลที่กรอกใช้เพื่อสร้างบัญชีสมาชิกและให้สิทธิประโยชน์ตามโปรแกรม
            (Demo)
          </p>
        </div>
      </section>
      <PolicyModal
        open={openPolicy}
        version={form.policyVersion}
        onClose={() => setOpenPolicy(false)}
      />

      <style>{`a{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
    </main>
  );
}

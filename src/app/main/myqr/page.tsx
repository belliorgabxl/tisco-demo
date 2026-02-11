"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Camera,
  StopCircle,
  ShieldAlert,
  CheckCircle2,
  QrCode,
  ScanLine,
  Copy,
  RefreshCw,
} from "lucide-react";

type ScanState = "idle" | "starting" | "scanning" | "stopped" | "error";
type Mode = "scan" | "myqr";

function isSecureContextOk() {
  if (typeof window === "undefined") return true;
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  return window.isSecureContext || isLocalhost;
}

type MeApi = {
  authenticated: boolean;
  user?: {
    userId: string;
    memberNo?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
};

export default function MyQRPage() {
  // toggle mode
  const [mode, setMode] = useState<Mode>("scan");

  // ===== Scan QR (ของเดิม) =====
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const zxingCleanupRef = useRef<null | (() => void)>(null);

  const [state, setState] = useState<ScanState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");

  function stopAll() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (zxingCleanupRef.current) {
      zxingCleanupRef.current();
      zxingCleanupRef.current = null;
    }
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState("stopped");
  }

  async function start() {
    try {
      setError(null);
      setResult("");
      setState("starting");

      if (!isSecureContextOk()) {
        throw new Error("หน้านี้ต้องเปิดผ่าน https:// (หรือ localhost) เท่านั้น เพื่อใช้งานกล้อง");
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("เบราว์เซอร์นี้ไม่รองรับการใช้งานกล้อง (getUserMedia)");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error("Video element not ready");
      video.srcObject = stream;
      await video.play();

      const canUseBarcodeDetector =
        typeof window !== "undefined" && "BarcodeDetector" in window;

      if (canUseBarcodeDetector) {
        await runWithBarcodeDetector();
        return;
      }
      await runWithZXing();
    } catch (e: any) {
      setState("error");
      setError(e?.message ?? "เริ่มสแกนไม่สำเร็จ");
      stopAll();
    }
  }

  async function runWithBarcodeDetector() {
    // @ts-ignore
    const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
    setState("scanning");

    const tick = async () => {
      try {
        const video = videoRef.current;
        if (!video) return;

        // @ts-ignore
        const barcodes = await detector.detect(video);
        if (Array.isArray(barcodes) && barcodes.length > 0) {
          const raw = barcodes[0]?.rawValue ?? "";
          if (raw) {
            setResult(raw);
            stopAll();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      } catch (e: any) {
        try {
          await runWithZXing();
        } catch (err: any) {
          setState("error");
          setError(err?.message ?? "สแกนไม่สำเร็จ");
          stopAll();
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  async function runWithZXing() {
    setState("scanning");
    const { BrowserQRCodeReader } = await import("@zxing/browser");
    const codeReader = new BrowserQRCodeReader();

    const video = videoRef.current;
    if (!video) throw new Error("Video element not ready");

    const controls = await codeReader.decodeFromVideoElement(video, (res) => {
      if (res?.getText) {
        const text = res.getText();
        if (text) {
          setResult(text);
          controls.stop();
          stopAll();
        }
      }
    });

    zxingCleanupRef.current = () => {
      try {
        controls.stop();
      } catch {}
    };
  }

  // cleanup when unmount
  useEffect(() => {
    return () => stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // stop camera when switch to myqr
  useEffect(() => {
    if (mode === "myqr") stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ===== My QR =====
  const [me, setMe] = useState<MeApi | null>(null);
  const [myQrDataUrl, setMyQrDataUrl] = useState<string>("");
  const [myQrError, setMyQrError] = useState<string | null>(null);
  const [myQrLoading, setMyQrLoading] = useState(false);

  const myPayload = useMemo(() => {
    const u = me?.user;
    if (!u?.userId) return "";
    // payload แบบมาตรฐาน: ปรับได้ตาม backend
    return JSON.stringify({
      type: "USER",
      userId: u.userId,
      memberNo: u.memberNo ?? "",
      ts: Date.now(),
    });
  }, [me]);

  async function loadMyQr() {
    try {
      setMyQrError(null);
      setMyQrLoading(true);

      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const json: MeApi = await res.json().catch(() => ({ authenticated: false }));

      if (!res.ok || !json?.authenticated || !json?.user?.userId) {
        throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้ (ยังไม่ได้ login?)");
      }

      setMe(json);

      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(myPayload || "NO_USER", {
        margin: 1,
        width: 520,
        errorCorrectionLevel: "M",
      });
      setMyQrDataUrl(url);
    } catch (e: any) {
      setMyQrError(e?.message ?? "สร้าง QR ไม่สำเร็จ");
      setMyQrDataUrl("");
    } finally {
      setMyQrLoading(false);
    }
  }

  // auto load when open myqr
  useEffect(() => {
    if (mode !== "myqr") return;
    loadMyQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <main className="relative min-h-dvh overflow-hidden flex justify-center px-4 py-4 text-sky-50">
      {/* bg */}
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

      <section className="w-full max-w-[520px] relative pb-28">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/main/home"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90
              backdrop-blur-xl hover:bg-white/15 active:scale-[0.99] transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="text-sm font-bold text-white/90">QR Center</div>

          <div className="w-[76px]" />
        </div>

        {/* Toggle */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setMode("scan")}
            className={`h-11 rounded-2xl text-sm font-extrabold transition inline-flex items-center justify-center gap-2
              ${mode === "scan" ? "bg-white text-gray-900" : "bg-transparent text-white/80 hover:bg-white/10"}`}
          >
            <ScanLine className="h-4 w-4" />
            Scan QR
          </button>

          <button
            type="button"
            onClick={() => setMode("myqr")}
            className={`h-11 rounded-2xl text-sm font-extrabold transition inline-flex items-center justify-center gap-2
              ${mode === "myqr" ? "bg-white text-gray-900" : "bg-transparent text-white/80 hover:bg-white/10"}`}
          >
            <QrCode className="h-4 w-4" />
            My QR
          </button>
        </div>

        {/* content */}
        {mode === "scan" ? (
          <>
            {!isSecureContextOk() ? (
              <div className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-50">
                หน้านี้ต้องเปิดผ่าน <b>https://</b> เพื่อใช้งานกล้อง (ยกเว้น localhost)
              </div>
            ) : null}

            <div
              className="mt-4 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl
              shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-white/90">กล้องสแกน QR</div>
                  <div className="mt-0.5 text-xs text-white/60">
                    แนะนำเปิดผ่าน Chrome มือถือ + กดอนุญาตกล้อง
                  </div>
                </div>

                {state !== "scanning" ? (
                  <button
                    type="button"
                    onClick={start}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-extrabold text-gray-900
                      hover:-translate-y-px active:scale-[0.99] transition"
                  >
                    <Camera className="h-4 w-4" />
                    Start
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopAll}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-extrabold text-white/90
                      hover:bg-white/15 active:scale-[0.99] transition"
                  >
                    <StopCircle className="h-4 w-4" />
                    Stop
                  </button>
                )}
              </div>

              <div className="px-4 pb-4">
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/30">
                  <video
                    ref={videoRef}
                    className="w-full aspect-[3/4] object-cover"
                    playsInline
                    muted
                  />
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-1/2 h-[62%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/35" />
                    <div className="absolute left-1/2 top-1/2 h-[62%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                  </div>
                </div>

                <div className="mt-3">
                  {state === "scanning" ? (
                    <div className="text-xs text-white/70">กำลังสแกน... เล็ง QR ให้อยู่ในกรอบ</div>
                  ) : state === "starting" ? (
                    <div className="text-xs text-white/70">กำลังเปิดกล้อง...</div>
                  ) : null}

                  {error ? (
                    <div className="mt-3 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-3 text-xs text-rose-50">
                      <div className="flex items-center gap-2 font-bold">
                        <ShieldAlert className="h-4 w-4" />
                        เปิดกล้องไม่ได้
                      </div>
                      <div className="mt-1 opacity-90">{error}</div>
                      <div className="mt-2 text-[11px] text-rose-100/80">
                        ทริค: เปิดผ่าน https, กดอนุญาตกล้อง, เปิดใน Chrome จริง, หรือ Site settings → Camera
                      </div>
                    </div>
                  ) : null}

                  {result ? (
                    <div className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-xs text-emerald-50">
                      <div className="flex items-center gap-2 font-extrabold">
                        <CheckCircle2 className="h-4 w-4" />
                        สแกนสำเร็จ
                      </div>
                      <div className="mt-2 break-all rounded-xl border border-white/10 bg-white/5 p-2 text-[12px] text-white/90">
                        {result}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => navigator.clipboard?.writeText(result)}
                          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[12px] font-bold text-white/90 hover:bg-white/15 inline-flex items-center gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </button>

                        {result.startsWith("http") ? (
                          <a
                            href={result}
                            className="rounded-xl bg-white px-3 py-2 text-[12px] font-extrabold text-gray-900 hover:-translate-y-px active:scale-[0.99] transition"
                          >
                            Open Link
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            className="mt-4 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl
            shadow-[0_14px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <div className="p-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-white/90">My QR</div>
                <div className="mt-0.5 text-xs text-white/60">
                  ให้แคชเชียร์/พนักงานสแกน QR นี้
                </div>
              </div>

              <button
                type="button"
                onClick={loadMyQr}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-extrabold text-white/90 hover:bg-white/15"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            <div className="px-4 pb-4">
              {myQrError ? (
                <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-3 text-xs text-rose-50">
                  {myQrError}
                </div>
              ) : null}

              <div className="mt-3 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex justify-center">
                  <div className="h-[260px] w-[260px] rounded-3xl border border-white/15 bg-white/5 grid place-items-center overflow-hidden">
                    {myQrLoading ? (
                      <div className="text-xs text-white/70">กำลังสร้าง QR...</div>
                    ) : myQrDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={myQrDataUrl} alt="my-qr" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-xs text-white/70">กด Refresh เพื่อสร้าง QR</div>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <div className="text-sm font-extrabold text-white/90">
                    {me?.user?.memberNo ?? "Member"}
                  </div>
                  <div className="mt-0.5 text-[11px] text-white/55 break-all">
                    {myPayload || "—"}
                  </div>

                  <div className="mt-3 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => myPayload && navigator.clipboard?.writeText(myPayload)}
                      disabled={!myPayload}
                      className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[12px] font-bold text-white/90 hover:bg-white/15 disabled:opacity-60 inline-flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy payload
                    </button>
                  </div>

                  <div className="mt-3 text-[11px] text-white/55">
                    * แนะนำเปิด QR บนมือถือ แล้วให้คนอื่นสแกน
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`button{-webkit-tap-highlight-color:transparent;} input{-webkit-tap-highlight-color:transparent;}`}</style>
      </section>
    </main>
  );
}

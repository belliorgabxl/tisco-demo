"use client";

export default function RewardsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-sky-50">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10
        bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(88,197,255,0.28),transparent_55%),radial-gradient(900px_500px_at_90%_25%,rgba(45,110,255,0.22),transparent_58%),linear-gradient(180deg,#07162F_0%,#061225_55%,#040A14_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-45
        [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]
        [background-size:28px_28px]
        [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_70%)]"
      />

      <main className="relative px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white/95">
            Rewards Management
          </h1>
          <p className="text-white/65 mt-1.5 text-sm">
            จัดการของรางวัลและไอเทม
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 p-8 backdrop-blur-xl shadow-[0_14px_30px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-white/70">Rewards content coming soon...</p>
        </div>
      </main>
    </div>
  );
}

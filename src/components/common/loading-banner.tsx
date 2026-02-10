export function BannerSkeleton() {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl shadow-[0_14px_30px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-2xl bg-white/10 animate-pulse ring-1 ring-white/10" />
        <div className="flex-1">
          <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
          <div className="mt-2 h-3 w-52 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-2xl bg-white/10 animate-pulse ring-1 ring-white/10" />
          <div className="h-10 w-10 rounded-2xl bg-white/10 animate-pulse ring-1 ring-white/10" />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4">
        <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
        <div className="mt-2 h-8 w-40 rounded bg-white/10 animate-pulse" />
        <div className="mt-2 h-3 w-56 rounded bg-white/10 animate-pulse" />
        <div className="mt-4 h-10 w-28 rounded-2xl bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

export function BannerError({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl shadow-[0_14px_30px_rgba(0,0,0,0.25)]">
      <div className="text-sm font-bold text-white/90">
        โหลดข้อมูลผู้ใช้ไม่สำเร็จ
      </div>
      <div className="mt-1 text-xs text-white/70">{message}</div>
      <div className="mt-3 text-xs text-white/70">
        (ถ้าเป็น 401 ให้พาไปหน้า Login หรือเช็ค cookie/token)
      </div>
    </div>
  );
}

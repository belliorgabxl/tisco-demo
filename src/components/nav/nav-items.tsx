import { cn } from "@/libs/utils/format";

export function NavItem({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition active:scale-[0.98]",
        active ? "bg-gray-200/10" : "hover:bg-gray-100/10",
      )}
    >
      <div
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-2xl ring-1",
          active
            ? "bg-white/10 text-sky-100 ring-white/15"
            : "bg-white/10 text-white/85 ring-white/15",
        )}
      >
        {icon}
      </div>
      <div
        className={cn(
          "text-[10px] font-bold",
          active ? "text-sky-100" : "text-white/70",
        )}
      >
        {label}
      </div>
    </button>
  );
}

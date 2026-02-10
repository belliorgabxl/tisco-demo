export type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ label, required, hint, children }: FieldProps) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-white/70">
          {label} {required ? <span className="text-rose-300">*</span> : null}
        </span>
        {hint ? <span className="text-[11px] text-white/45">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

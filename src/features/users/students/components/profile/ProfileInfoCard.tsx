import type { ReactNode } from "react";

type ProfileInfoCardProps = {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
  className?: string;
};

export function ProfileInfoCard({
  icon,
  label,
  value,
  className = "",
}: ProfileInfoCardProps) {
  return (
    <div
      className={[
        "rounded-[24px] border border-slate-100 bg-slate-50/80 p-4",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] bg-white text-slate-600 shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400">
            {label}
          </p>

          <div className="mt-1 truncate text-sm font-black text-slate-800">
            {value || "غير محدد"}
          </div>
        </div>
      </div>
    </div>
  );
}
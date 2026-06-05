import type { LucideIcon } from "lucide-react";

type ProfileInfoItemProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};

export function ProfileInfoItem({ label, value, icon: Icon }: ProfileInfoItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-background/70 p-3 ring-1 ring-border/60">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={17} />
      </span>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
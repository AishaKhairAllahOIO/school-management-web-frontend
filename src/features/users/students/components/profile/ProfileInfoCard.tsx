import type { ReactNode } from "react";

type ProfileInfoCardProps = {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
  className?: string;
};

function hasDisplayValue(value: ReactNode) {
  return value !== null && value !== undefined && value !== "";
}

export function ProfileInfoCard({ icon, label, value, className = "" }: ProfileInfoCardProps) {
  return (
    <article className={["group rounded-[18px] border border-border/60 bg-muted/30 p-4 transition-colors hover:border-primary/15 hover:bg-primary/[0.025]", className].join(" ")}>
      <p className="text-[10px] font-medium uppercase tracking-[0.09em] text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium leading-6 text-foreground">
        <span className="shrink-0 text-primary">{icon}</span>
        <span className="break-words">{hasDisplayValue(value) ? value : "Not specified"}</span>
      </div>
    </article>
  );
}

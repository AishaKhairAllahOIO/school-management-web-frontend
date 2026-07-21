import type { ReactNode } from "react";

type ProfileInfoCardProps = {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
  className?: string;
};

function hasDisplayValue(
  value: ReactNode,
) {
  return (
    value !== null &&
    value !== undefined &&
    value !== ""
  );
}

export function ProfileInfoCard({
  icon,
  label,
  value,
  className = "",
}: ProfileInfoCardProps) {
  return (
    <article
      className={[
        "group rounded-[24px] border border-border/70 bg-card/75 p-4",
        "shadow-[var(--shadow-soft)] backdrop-blur transition",
        "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[var(--shadow-card)]",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground">
            {label}
          </p>

          <div className="mt-1 break-words text-sm font-bold leading-6 text-foreground">
            {hasDisplayValue(value)
              ? value
              : "Not specified"}
          </div>
        </div>
      </div>
    </article>
  );
}

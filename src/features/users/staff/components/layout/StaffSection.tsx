import type {
  ReactNode,
} from "react";

type StaffSectionProps = {
  eyebrow: string;
  title: string;
  description: string;

  icon: ReactNode;
  children: ReactNode;

  className?: string;
  contentClassName?: string;
};

export function StaffSection({
  eyebrow,
  title,
  description,
  icon,
  children,
  className = "",
  contentClassName = "",
}: StaffSectionProps) {
  return (
    <section
      className={[
        "overflow-hidden rounded-[26px]",
        "border border-border/70 bg-card",
        "shadow-[var(--shadow-card)]",
        className,
      ].join(" ")}
    >
      <header
        className={[
          "flex items-start gap-3",
          "border-b border-border/60",
          "bg-muted/25 px-5 py-4",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-11 w-11 shrink-0",
            "items-center justify-center",
            "rounded-[15px]",
            "bg-primary/[0.08] text-primary",
          ].join(" ")}
        >
          {icon}
        </span>

        <div className="min-w-0">
          <p
            className={[
              "text-[10px] font-semibold",
              "uppercase tracking-[0.13em]",
              "text-primary",
            ].join(" ")}
          >
            {eyebrow}
          </p>

          <h2
            className={[
              "mt-0.5 text-[17px]",
              "font-semibold",
              "tracking-[-0.02em]",
              "text-foreground",
            ].join(" ")}
          >
            {title}
          </h2>

          <p
            className={[
              "mt-1 text-[13px]",
              "font-normal leading-5",
              "text-muted-foreground",
            ].join(" ")}
          >
            {description}
          </p>
        </div>
      </header>

      <div
        className={[
          "p-5 sm:p-6",
          contentClassName,
        ].join(" ")}
      >
        {children}
      </div>
    </section>
  );
}
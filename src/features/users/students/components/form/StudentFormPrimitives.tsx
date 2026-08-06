import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export const fieldClassName = [
  "h-12 w-full rounded-[16px]",
  "border border-border/70 bg-muted/25 px-4",
  "text-sm font-normal text-foreground",
  "outline-none transition duration-200",
  "placeholder:text-muted-foreground/70",
  "hover:border-primary/20 hover:bg-card",
  "focus:border-primary/35 focus:bg-card",
  "focus:ring-4 focus:ring-primary/[0.08]",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  required = false,
  hint,
  children,
  className = "",
}: FieldProps) {
  return (
    <label className={["block", className].join(" ")}>
      <span className="mb-2 flex items-center gap-1 text-xs font-medium text-foreground">
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-[11px] font-normal leading-4 text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

type SectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  completed?: boolean;
  className?: string;
  contentClassName?: string;
};

export function FormSection({
  eyebrow,
  title,
  description,
  icon,
  children,
  completed = false,
  className = "",
  contentClassName = "",
}: SectionProps) {
  return (
    <section
      className={[
        "overflow-hidden rounded-[26px]",
        "border border-border/70 bg-card",
        "shadow-[var(--shadow-card)]",
        className,
      ].join(" ")}
    >
      <header className="flex items-start justify-between gap-4 border-b border-border/60 bg-muted/25 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.08] text-primary">
            {icon}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-primary">
              {eyebrow}
            </p>
            <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em] text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-[13px] font-normal leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {completed ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/[0.1] text-success">
            <CheckCircle2 size={17} strokeWidth={1.8} />
          </span>
        ) : null}
      </header>
      <div className={["p-5 sm:p-6", contentClassName].join(" ")}>{children}</div>
    </section>
  );
}

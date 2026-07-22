import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export const fieldClassName = [
  "h-11 w-full rounded-xl",
  "border border-border/70",
  "bg-background px-3.5",
  "text-sm font-normal text-foreground",
  "outline-none transition-all duration-200",
  "placeholder:text-muted-foreground/65",
  "hover:border-primary/25",
  "focus:border-primary/45",
  "focus:bg-card",
  "focus:ring-4",
  "focus:ring-primary/10",
  "disabled:cursor-not-allowed",
  "disabled:bg-muted/40",
  "disabled:opacity-70",
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
    <label
      className={["block", className].join(" ")}
    >
      <span className="mb-2 flex items-center gap-1 text-xs font-medium text-foreground">
        {label}

        {required ? (
          <span className="text-destructive">
            *
          </span>
        ) : null}
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
};

export function FormSection({
  eyebrow,
  title,
  description,
  icon,
  children,
  completed = false,
}: SectionProps) {
  return (
    <section
      className={[
        "overflow-hidden rounded-[24px]",
        "border border-border/60",
        "bg-card",
        "shadow-[0_12px_40px_rgba(30,20,70,0.05)]",
      ].join(" ")}
    >
      <header className="flex items-start justify-between gap-4 border-b border-border/50 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.075] text-primary">
            {icon}
          </span>

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-primary">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-foreground">
              {title}
            </h2>

            <p className="mt-1 max-w-2xl text-xs font-normal leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {completed ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/[0.1] text-emerald-600">
            <CheckCircle2
              size={17}
              strokeWidth={1.8}
            />
          </span>
        ) : null}
      </header>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}
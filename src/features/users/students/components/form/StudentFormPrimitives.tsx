import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

export const fieldClassName =
  "h-12 w-full rounded-2xl border border-border bg-muted/70 px-4 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground/65 hover:border-primary/25 focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10";

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
      <span className="mb-2 flex items-center gap-1 text-sm font-black text-foreground">
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-xs font-medium text-muted-foreground">
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
    <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-[var(--shadow-card)]">
      <header className="flex items-start justify-between gap-4 border-b border-border/70 bg-secondary/35 px-5 py-5 sm:px-6">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.13em] text-primary">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {completed ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-5 w-5" />
          </span>
        ) : null}
      </header>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

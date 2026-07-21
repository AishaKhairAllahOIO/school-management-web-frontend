import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type StudentPageHeaderProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  showBackButton?: boolean;
};

export function StudentPageHeader({
  title,
  description,
  icon,
  actions,
  showBackButton = false,
}: StudentPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="relative overflow-hidden rounded-[34px] border border-border/70 bg-card px-5 py-6 shadow-[var(--shadow-card)] sm:px-7">
      <div className="soft-purple-gradient pointer-events-none absolute inset-0 opacity-65" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          {showBackButton ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-card/80 text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : null}

          {icon ? (
            <div className="primary-gradient flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] text-primary-foreground shadow-[var(--shadow-auth-button)]">
              {icon}
            </div>
          ) : null}

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
              Student management
            </p>
            <h1 className="mt-1 truncate text-3xl font-black tracking-[-0.04em] text-foreground sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

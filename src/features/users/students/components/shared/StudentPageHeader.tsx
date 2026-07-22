import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
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
    <header className="border-b border-border/60 pb-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          {showBackButton ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className={[
                "flex h-10 w-10 shrink-0",
                "items-center justify-center",
                "rounded-xl border border-border/70",
                "bg-card text-muted-foreground",
                "transition-all duration-200",
                "hover:border-primary/20",
                "hover:bg-primary/[0.045]",
                "hover:text-primary",
                "focus-visible:outline-none",
                "focus-visible:ring-4",
                "focus-visible:ring-primary/10",
              ].join(" ")}
            >
              <ArrowLeft
                size={18}
                strokeWidth={1.8}
              />
            </button>
          ) : null}

          {icon ? (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.08] text-primary">
              {icon}
            </span>
          ) : null}

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
              Student workspace
            </p>

            <h1 className="mt-1 truncate text-[28px] font-semibold tracking-[-0.035em] text-foreground sm:text-[30px]">
              {title}
            </h1>

            {description ? (
              <p className="mt-1.5 max-w-3xl text-sm font-normal leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
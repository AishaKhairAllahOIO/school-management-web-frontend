import { ArrowLeft, GraduationCap } from "lucide-react";

import { UserAvatar } from "../../../shared/components/UserAvatar";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type StudentPageHeaderProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  showBackButton?: boolean;
  backLabel?: string;
  onBack?: () => void;
  photoUrl?: string | null;
  photoAlt?: string;
};

export function StudentPageHeader({
  title,
  description,
  icon,
  actions,
  showBackButton = false,
  backLabel = "Back to students",
  onBack,
  photoUrl,
  photoAlt,
}: StudentPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-[22px] border border-primary/20 bg-card shadow-[var(--shadow-floating)]">
      <div className="absolute inset-0 bg-primary/[0.08] opacity-70" />
      <div className="pointer-events-none absolute -right-16 -top-24 h-52 w-52 rounded-full bg-primary opacity-[0.12] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-44 w-44 rounded-full bg-primary opacity-[0.06] blur-3xl" />

      <div className="relative p-4 sm:px-5 sm:py-4">
        {showBackButton ? (
          <button
            type="button"
            onClick={onBack ?? (() => navigate("/users/students"))}
            className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/[0.07] hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            {backLabel}
          </button>
        ) : null}

        <div
          className={[
            "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
            showBackButton ? "mt-3" : "",
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-3.5">
            {photoUrl ? (
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[14px] border border-primary/20 bg-card shadow-[var(--shadow-card)]">
                <UserAvatar
                  src={photoUrl}
                  alt={photoAlt ?? title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
                {icon ?? (
                  <GraduationCap className="h-5 w-5" strokeWidth={1.8} />
                )}
              </span>
            )}

            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.08] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary">
                <GraduationCap className="h-3 w-3" strokeWidth={1.9} />
                Student profile
              </span>
              <h1 className="mt-1 truncate text-2xl font-semibold tracking-[-0.035em] text-foreground">
                {title}
              </h1>
              {description ? (
                <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 self-start lg:self-center">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
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
    <header className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white px-5 py-6 shadow-[0_20px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute -left-14 -top-16 h-52 w-52 rounded-full bg-rose-100/70 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />

      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          {showBackButton ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              aria-label="رجوع"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : null}

          {icon ? (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-slate-950 text-white shadow-lg shadow-slate-300">
              {icon}
            </div>
          ) : null}

          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-3">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
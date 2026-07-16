import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type UserCategoryCardProps = {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  count?: number;
  countLabel: string;
  secondaryCount?: number;
  secondaryCountLabel?: string;
  accentClassName: string;
  iconClassName: string;
};

function formatCount(count?: number) {
  if (typeof count !== "number") {
    return "—";
  }

  return new Intl.NumberFormat().format(count);
}

export function UserCategoryCard({
  title,
  description,
  path,
  icon: Icon,
  count,
  countLabel,
  secondaryCount,
  secondaryCountLabel,
  accentClassName,
  iconClassName,
}: UserCategoryCardProps) {
  const hasSecondaryCount =
    typeof secondaryCount === "number" &&
    Boolean(secondaryCountLabel);

  return (
    <article
      className={[
        "group relative flex min-h-[190px] flex-col overflow-hidden",
        "rounded-2xl border border-border/70 bg-card",
        "shadow-card transition duration-200",
        "hover:-translate-y-0.5 hover:border-primary/20",
        "hover:shadow-floating",
        "motion-reduce:transform-none motion-reduce:transition-none",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-[3px]",
          accentClassName,
        ].join(" ")}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center",
              "rounded-xl",
              iconClassName,
            ].join(" ")}
          >
            <Icon
              aria-hidden="true"
              className="h-6 w-6"
              strokeWidth={1.8}
            />
          </div>

          <Link
            to={path}
            aria-label={`Open ${title}`}
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center",
              "rounded-full text-muted-foreground",
              "transition duration-200",
              "hover:bg-muted hover:text-primary",
              "focus-visible:outline-none",
              "focus-visible:ring-4 focus-visible:ring-primary/15",
            ].join(" ")}
          >
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-bold tracking-[-0.02em] text-foreground">
            {title}
          </h2>

          <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <div className="border-t border-border/70 pt-4">
            <div
              className={[
                "grid items-end gap-3",
                hasSecondaryCount
                  ? "grid-cols-2"
                  : "grid-cols-1",
              ].join(" ")}
            >
              <div>
                <strong className="block text-2xl font-bold tracking-[-0.035em] text-foreground">
                  {formatCount(count)}
                </strong>

                <span className="mt-0.5 block text-xs font-medium text-muted-foreground">
                  {countLabel}
                </span>
              </div>

              {hasSecondaryCount && (
                <div className="border-l border-border/70 pl-3">
                  <strong className="block text-xl font-bold tracking-[-0.03em] text-foreground">
                    {formatCount(secondaryCount)}
                  </strong>

                  <span className="mt-0.5 block text-xs font-medium text-muted-foreground">
                    {secondaryCountLabel}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
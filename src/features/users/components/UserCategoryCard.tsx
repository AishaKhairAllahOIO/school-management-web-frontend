import {
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/locale";

type UserCategoryCardProps = {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;

  count?: number;
  countLabel: string;
  isCountLoading?: boolean;

  secondaryCount?: number;
  secondaryCountLabel?: string;
  isSecondaryCountLoading?: boolean;

  viewLabel: string;

  accentClassName: string;
  iconClassName: string;
  footerClassName: string;
  footerTextClassName: string;
};

function formatCount(
  count?: number,
): string {
  if (typeof count !== "number") {
    return "—";
  }

  return new Intl.NumberFormat().format(
    count,
  );
}

function CountSkeleton({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        "block animate-pulse",
        "rounded-[7px]",
        "bg-muted/65",
        compact
          ? "h-[21px] w-10"
          : "h-6 w-12",
      ].join(" ")}
    />
  );
}

export function UserCategoryCard({
  title,
  description,
  path,
  icon: Icon,
  count,
  countLabel,
  isCountLoading = false,
  secondaryCount,
  secondaryCountLabel,
  isSecondaryCountLoading = false,
  viewLabel,
  accentClassName,
  iconClassName,
  footerClassName,
  footerTextClassName,
}: UserCategoryCardProps) {
  const { t } = useLocale();

  const hasSecondaryCount =
    Boolean(secondaryCountLabel) &&
    (
      typeof secondaryCount === "number" ||
      isSecondaryCountLoading
    );

  return (
    <article
      className={[
        "group relative",
        "flex min-h-[232px] flex-col",
        "overflow-hidden",
        "rounded-[18px]",
        "border border-border/65",
        "bg-card",
        "shadow-[0_7px_24px_rgba(30,20,70,0.04)]",
        "transition-all duration-300",
        "hover:-translate-y-0.5",
        "hover:border-primary/20",
        "hover:shadow-[0_14px_34px_rgba(30,20,70,0.075)]",
        "motion-reduce:transform-none",
        "motion-reduce:transition-none",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute inset-x-0 top-0",
          "h-[3px]",
          accentClassName,
        ].join(" ")}
      />

      <div className="flex flex-1 flex-col px-5 pb-3.5 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div
            className={[
              "flex h-10 w-10 shrink-0",
              "items-center justify-center",
              "rounded-[13px]",
              iconClassName,
            ].join(" ")}
          >
            <Icon
              aria-hidden="true"
              className="h-5 w-5"
              strokeWidth={1.75}
            />
          </div>

          <Link
            to={path}
            aria-label={`${t.users.shared.openCategory}: ${title}`}
            className={[
              "flex h-8 w-8 shrink-0",
              "items-center justify-center",
              "rounded-full",
              "text-muted-foreground",
              "transition-all duration-200",
              "hover:bg-muted/55",
              "hover:text-foreground",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              "focus-visible:ring-primary/10",
            ].join(" ")}
          />
        </div>

        <div className="mt-3">
          <h2
            className={[
              "text-[18px]",
              "font-semibold",
              "tracking-[-0.02em]",
              "text-foreground",
            ].join(" ")}
          >
            {title}
          </h2>

          <p
            className={[
              "mt-1 min-h-9",
              "line-clamp-2",
              "text-[13px]",
              "font-normal",
              "leading-[19px]",
              "text-muted-foreground",
            ].join(" ")}
          >
            {description}
          </p>
        </div>

        <div className="mt-auto pt-3">
          <div className="border-t border-border/55 pt-3">
            <div
              className={[
                "grid items-end gap-3",
                hasSecondaryCount
                  ? "grid-cols-2"
                  : "grid-cols-1",
              ].join(" ")}
            >
              <div className="min-w-0">
                <div className="flex min-h-6 items-end">
                  {isCountLoading ? (
                    <CountSkeleton />
                  ) : (
                    <strong
                      className={[
                        "block",
                        "text-[24px]",
                        "font-semibold",
                        "leading-none",
                        "tracking-[-0.04em]",
                        "text-foreground",
                      ].join(" ")}
                    >
                      {formatCount(count)}
                    </strong>
                  )}
                </div>

                <span
                  className={[
                    "mt-1 block truncate",
                    "text-[11px]",
                    "font-normal",
                    "text-muted-foreground",
                  ].join(" ")}
                >
                  {countLabel}
                </span>
              </div>

              {hasSecondaryCount && (
                <div
                  className={[
                    "min-w-0",
                    "border-s border-border/60",
                    "ps-3",
                  ].join(" ")}
                >
                  <div className="flex min-h-[21px] items-end">
                    {isSecondaryCountLoading ? (
                      <CountSkeleton compact />
                    ) : (
                      <strong
                        className={[
                          "block",
                          "text-[21px]",
                          "font-semibold",
                          "leading-none",
                          "tracking-[-0.035em]",
                          "text-foreground",
                        ].join(" ")}
                      >
                        {formatCount(
                          secondaryCount,
                        )}
                      </strong>
                    )}
                  </div>

                  <span
                    className={[
                      "mt-1 block truncate",
                      "text-[11px]",
                      "font-normal",
                      "text-muted-foreground",
                    ].join(" ")}
                  >
                    {secondaryCountLabel}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Link
        to={path}
        className={[
          "flex h-11 shrink-0",
          "items-center justify-between",
          "gap-3",
          "border-t border-border/35",
          "px-5",
          "transition-colors duration-200",
          footerClassName,
          footerTextClassName,
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-inset",
          "focus-visible:ring-primary/25",
        ].join(" ")}
      >
        <span className="text-[12px] font-medium">
          {viewLabel}
        </span>

        <ArrowRight
          aria-hidden="true"
          className={[
            "h-4 w-4",
            "transition-transform duration-200",
            "group-hover:translate-x-1",
            "rtl:rotate-180",
            "rtl:group-hover:-translate-x-1",
          ].join(" ")}
          strokeWidth={1.8}
        />
      </Link>
    </article>
  );
}
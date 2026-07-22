import { useLocale } from "@/app/providers/locale";

import {
  getCurrentPageTitle,
  getSectionKey,
} from "./topbar.helpers";

type TopbarBreadcrumbProps = {
  pathname: string;
};

export function TopbarBreadcrumb({
  pathname,
}: TopbarBreadcrumbProps) {
  const { t } = useLocale();

  const sectionKey =
    getSectionKey(pathname);

  const sectionTitle =
    t.navigation[sectionKey];

  const currentPageTitle =
    getCurrentPageTitle(
      pathname,
      t.layout.topbar.overview,
    );

  const isSameTitle =
    sectionTitle
      .trim()
      .toLowerCase() ===
    currentPageTitle
      .trim()
      .toLowerCase();

  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden min-w-0 items-center lg:flex"
    >
      <ol className="flex min-w-0 items-center gap-3">
        <li className="min-w-0">
          <span
            className={[
              "inline-flex h-9 max-w-[190px]",
              "items-center rounded-xl",
              "border border-primary/10",
              "bg-primary/[0.07]",
              "px-4",
              "text-[13px] font-semibold",
              "tracking-[-0.015em]",
              "text-primary",
            ].join(" ")}
          >
            <span className="truncate">
              {sectionTitle}
            </span>
          </span>
        </li>

        {!isSameTitle ? (
          <>
            <li
              aria-hidden="true"
              className={[
                "flex h-9 items-center",
                "text-[14px] font-medium",
                "text-topbar-subtle/55",
              ].join(" ")}
            >
              /
            </li>

            <li className="min-w-0">
              <span
                aria-current="page"
                className={[
                  "inline-flex h-9 max-w-[190px]",
                  "items-center rounded-xl",
                  "border border-topbar-border/75",
                  "bg-topbar-surface/80",
                  "px-4",
                  "text-[13px] font-medium",
                  "tracking-[-0.01em]",
                  "text-topbar-text",
                  "shadow-[0_4px_14px_rgba(30,20,70,0.035)]",
                  "backdrop-blur-sm",
                ].join(" ")}
              >
                <span className="truncate">
                  {currentPageTitle}
                </span>
              </span>
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}
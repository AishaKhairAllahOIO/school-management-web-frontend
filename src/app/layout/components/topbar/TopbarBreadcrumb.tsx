import {
  useLocale,
} from "@/app/providers/locale";

import {
  formatPathSegment,
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

  const segments = pathname
    .split("/")
    .filter(Boolean);

  const pageSegment =
    segments.length > 1
      ? segments[1]
      : "overview";

  const currentPageTitle =
    t.layout.breadcrumb.pages[
      pageSegment
    ] ??
    formatPathSegment(
      pageSegment,
    );

  const isSameTitle =
    sectionTitle.trim().toLowerCase() ===
    currentPageTitle
      .trim()
      .toLowerCase();

  return (
    <nav
      aria-label={
        t.layout.breadcrumb.label
      }
      className="
        hidden
        min-w-0
        translate-y-[2px]
        items-center
        lg:flex
      "
    >
      <ol
        className="
          flex
          items-center
          gap-3
          text-[15px]
          tracking-[-0.015em]
        "
      >
        <li className="max-w-[180px] truncate">
          <span
            className="
              font-semibold
              text-topbar-title
            "
          >
            {sectionTitle}
          </span>
        </li>

        {!isSameTitle ? (
          <>
            <li
              aria-hidden="true"
              className="text-topbar-muted/40"
            >
              /
            </li>

            <li className="max-w-[180px] truncate">
              <span
                className="
                  font-medium
                  text-topbar-muted
                "
              >
                {currentPageTitle}
              </span>
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}

import {
  useLocale,
} from "@/app/providers/locale";

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

  const sectionKey = getSectionKey(pathname);
  const sectionTitle = t.navigation[sectionKey];

  const currentPageTitle = getCurrentPageTitle(
    pathname,
    t.layout.breadcrumb.pages.overview ??
      t.layout.topbar.overview,
  );

  const translatedPageTitle =
    t.layout.breadcrumb.pages[
      currentPageTitle.toLowerCase()
    ] ?? currentPageTitle;

  const isSameTitle =
    sectionTitle.trim().toLowerCase() ===
    translatedPageTitle.trim().toLowerCase();

  return (
    <nav
      aria-label={t.layout.breadcrumb.label}
      className="min-w-0 translate-y-[1px]"
    >
      <ol className="flex min-w-0 items-center gap-2 text-[13px] tracking-[-0.015em] sm:gap-3 sm:text-[14px] lg:text-[15px]">
        <li className="max-w-[110px] truncate sm:max-w-[160px] lg:max-w-[210px]">
          <span className="font-semibold text-topbar-title">
            {sectionTitle}
          </span>
        </li>

        {!isSameTitle ? (
          <>
            <li
              aria-hidden="true"
              className="shrink-0 text-topbar-muted/40"
            >
              /
            </li>

            <li className="max-w-[105px] truncate sm:max-w-[160px] lg:max-w-[210px]">
              <span className="font-medium text-topbar-muted">
                {translatedPageTitle}
              </span>
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}

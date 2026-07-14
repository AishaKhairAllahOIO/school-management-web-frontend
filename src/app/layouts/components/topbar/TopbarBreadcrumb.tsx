import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  const { direction, t } = useLocale();

  const sectionKey = getSectionKey(pathname);
  const sectionTitle =
    t.navigation[sectionKey];

  const currentPageTitle =
    getCurrentPageTitle(
      pathname,
      t.layout.topbar.overview,
    );

  const BreadcrumbChevron =
    direction === "rtl"
      ? ChevronLeft
      : ChevronRight;

  return (
    <div className="hidden min-w-0 items-center gap-[13px] lg:flex">
      <h1 className="truncate text-[15px] font-bold tracking-[-0.02em] text-topbar-title">
        {sectionTitle}
      </h1>

      <BreadcrumbChevron
        aria-hidden="true"
        size={14}
        strokeWidth={1.9}
        className="shrink-0 text-topbar-subtle/55"
      />

      <span className="inline-flex h-[34px] max-w-[150px] shrink-0 items-center rounded-[12px] border border-topbar-border bg-topbar-soft px-[17px] text-[12px] font-semibold text-topbar-text">
        {currentPageTitle}
      </span>
    </div>
  );
}
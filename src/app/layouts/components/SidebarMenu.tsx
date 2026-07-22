import type { MouseEvent } from "react";
import {
  NavLink,
  useLocation,
} from "react-router-dom";

import { sidebarItems } from "@/app/layouts/config/sidebarItems";
import type { SidebarItem } from "@/app/layouts/types/sidebar.types";
import { useLocale } from "@/app/providers/locale";

type SidebarMenuProps = {
  variant: "icons" | "labels";
  onNavigate?: () => void;
};

function getRootPath(
  path: string,
): string {
  if (path === "/") {
    return "/";
  }

  const [firstSegment] = path
    .split("/")
    .filter(Boolean);

  return firstSegment
    ? `/${firstSegment}`
    : "/";
}

function isItemActive(
  pathname: string,
  item: SidebarItem,
): boolean {
  if (
    item.exact ||
    item.path === "/"
  ) {
    return pathname === item.path;
  }

  const rootPath =
    getRootPath(item.path);

  return (
    pathname === item.path ||
    pathname.startsWith(
      `${rootPath}/`,
    )
  );
}

function getVisibleSidebarItems(
  items: readonly SidebarItem[],
): SidebarItem[] {
  return items.filter(
    (item) => !item.hidden,
  );
}

function handleDisabledNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  disabled: boolean | undefined,
  onNavigate?: () => void,
) {
  if (disabled) {
    event.preventDefault();
    return;
  }

  onNavigate?.();
}

export function SidebarMenu({
  variant,
  onNavigate,
}: SidebarMenuProps) {
  const location = useLocation();
  const { direction, t } = useLocale();

  const visibleItems =
    getVisibleSidebarItems(
      sidebarItems,
    );

  if (variant === "icons") {
    return (
      <nav
        aria-label={t.layout.sidebar.navigation}
        className="flex w-full flex-col items-center gap-1.5"
      >
        {visibleItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            isItemActive(
              location.pathname,
              item,
            );

          const title =
            t.navigation[item.titleKey];

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              title={title}
              aria-label={title}
              aria-current={
                isActive
                  ? "page"
                  : undefined
              }
              aria-disabled={
                item.disabled ||
                undefined
              }
              tabIndex={
                item.disabled
                  ? -1
                  : 0
              }
              onClick={(event) =>
                handleDisabledNavigation(
                  event,
                  item.disabled,
                  onNavigate,
                )
              }
              className={[
                "relative flex h-11 w-11 flex-none",
                "items-center justify-center",
                "rounded-2xl",
                "text-sidebar-muted",
                "transition-colors duration-200",
                "hover:bg-sidebar-foreground/5",
                "hover:text-sidebar-foreground",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-sidebar-foreground/30",
                "motion-reduce:transition-none",
                item.disabled
                  ? "cursor-not-allowed opacity-40"
                  : "",
                isActive
                  ? [
                      "bg-sidebar-foreground/10",
                      "text-sidebar-foreground",
                      "ring-1 ring-sidebar-foreground/10",
                    ].join(" ")
                  : "",
                isActive &&
                direction === "rtl"
                  ? [
                      "before:absolute",
                      "before:-right-[18px]",
                      "before:top-1/2",
                      "before:h-7",
                      "before:w-[4px]",
                      "before:-translate-y-1/2",
                      "before:rounded-l-full",
                      "before:bg-sidebar-foreground",
                    ].join(" ")
                  : "",
                isActive &&
                direction === "ltr"
                  ? [
                      "before:absolute",
                      "before:-left-[18px]",
                      "before:top-1/2",
                      "before:h-7",
                      "before:w-[4px]",
                      "before:-translate-y-1/2",
                      "before:rounded-r-full",
                      "before:bg-sidebar-foreground",
                    ].join(" ")
                  : "",
              ].join(" ")}
            >
              <Icon
                aria-hidden="true"
                size={18}
                strokeWidth={2}
                className="h-[18px] w-[18px] shrink-0"
              />

              {item.badge ? (
                <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-sidebar-foreground px-1 text-[9px] font-bold text-sidebar">
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      aria-label={t.layout.sidebar.navigation}
      className="flex w-full flex-col gap-1"
    >
      {visibleItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          isItemActive(
            location.pathname,
            item,
          );

        const title =
          t.navigation[item.titleKey];

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            aria-current={
              isActive
                ? "page"
                : undefined
            }
            aria-disabled={
              item.disabled ||
              undefined
            }
            tabIndex={
              item.disabled
                ? -1
                : 0
            }
            onClick={(event) =>
              handleDisabledNavigation(
                event,
                item.disabled,
                onNavigate,
              )
            }
            className={[
              "relative flex h-11 w-full",
              "items-center gap-3",
              "rounded-2xl px-4",
              "text-[13px] font-semibold",
              "tracking-[-0.005em]",
              "transition-colors duration-200",
              "motion-reduce:transition-none",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-sidebar-foreground/30",
              item.disabled
                ? "cursor-not-allowed opacity-40"
                : "",
              isActive
                ? [
                    "bg-sidebar-foreground/10",
                    "text-sidebar-foreground",
                    "ring-1 ring-sidebar-foreground/10",
                  ].join(" ")
                : [
                    "text-sidebar-muted",
                    "hover:bg-sidebar-foreground/5",
                    "hover:text-sidebar-foreground",
                  ].join(" "),
            ].join(" ")}
          >
            <Icon
              aria-hidden="true"
              size={18}
              strokeWidth={2}
              className="h-[18px] w-[18px] shrink-0"
            />

            <span className="min-w-0 flex-1 truncate">
              {title}
            </span>

            {item.badge ? (
              <span className="ms-auto rounded-full bg-sidebar-foreground/10 px-1.5 py-0.5 text-[10px] font-bold text-sidebar-foreground">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        );
      })}
    </nav>
  );
}
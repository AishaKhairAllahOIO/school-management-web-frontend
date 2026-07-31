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

function getRootPath(path: string): string {
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
  if (item.exact || item.path === "/") {
    return pathname === item.path;
  }

  const rootPath = getRootPath(item.path);

  return (
    pathname === item.path ||
    pathname.startsWith(`${rootPath}/`)
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
  const { t } = useLocale();

  const visibleItems = sidebarItems.filter(
    (item) => !item.hidden,
  );

  if (variant === "icons") {
    return (
      <nav
        aria-label={t.layout.sidebar.navigation}
        className="flex w-full flex-col items-center gap-[clamp(3px,0.65vh,7px)]"
      >
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(
            location.pathname,
            item,
          );
          const title = t.navigation[item.titleKey];

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              title={title}
              aria-label={title}
              aria-current={isActive ? "page" : undefined}
              aria-disabled={item.disabled || undefined}
              tabIndex={item.disabled ? -1 : 0}
              onClick={(event) =>
                handleDisabledNavigation(
                  event,
                  item.disabled,
                  onNavigate,
                )
              }
              className={[
                "group relative flex",
                "h-[clamp(42px,5.35vh,48px)]",
                "w-[48px] flex-none",
                "items-center justify-center",
                "rounded-[17px]",
                "text-sidebar-muted",
                "transition-all duration-200",
                "hover:bg-sidebar-foreground/[0.055]",
                "hover:text-sidebar-foreground",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-sidebar-foreground/25",
                item.disabled
                  ? "cursor-not-allowed opacity-40"
                  : "",
                isActive
                  ? [
                      "bg-sidebar-foreground/[0.105]",
                      "text-sidebar-foreground",
                      "shadow-[0_10px_26px_rgb(0_0_0_/_0.14)]",
                    ].join(" ")
                  : "",
              ].join(" ")}
            >
              <Icon
                aria-hidden="true"
                size={19}
                strokeWidth={isActive ? 2 : 1.8}
                className="shrink-0 transition-transform duration-200 group-hover:scale-[1.04]"
              />

              {item.badge ? (
                <span className="absolute -end-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-sidebar-foreground px-1 text-[8px] font-semibold text-sidebar">
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
      className="flex w-full flex-col gap-[clamp(3px,0.65vh,7px)]"
    >
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive = isItemActive(
          location.pathname,
          item,
        );
        const title = t.navigation[item.titleKey];

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            aria-current={isActive ? "page" : undefined}
            aria-disabled={item.disabled || undefined}
            tabIndex={item.disabled ? -1 : 0}
            onClick={(event) =>
              handleDisabledNavigation(
                event,
                item.disabled,
                onNavigate,
              )
            }
            className={[
              "group relative flex w-full",
              "h-[clamp(42px,5.35vh,48px)]",
              "items-center gap-3",
              "rounded-[17px] px-3",
              "text-[13px] font-medium",
              "tracking-[-0.004em]",
              "transition-all duration-200",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-sidebar-foreground/25",
              item.disabled
                ? "cursor-not-allowed opacity-40"
                : "",
              isActive
                ? [
                    "bg-sidebar-foreground/[0.105]",
                    "text-sidebar-foreground",
                    "shadow-[0_10px_26px_rgb(0_0_0_/_0.14)]",
                  ].join(" ")
                : [
                    "text-sidebar-muted",
                    "hover:bg-sidebar-foreground/[0.045]",
                    "hover:text-sidebar-foreground",
                  ].join(" "),
            ].join(" ")}
          >
            <span
              className={[
                "flex h-8 w-8 shrink-0",
                "items-center justify-center",
                "text-current",
                "transition-transform duration-200",
                "group-hover:scale-[1.03]",
              ].join(" ")}
            >
              <Icon
                aria-hidden="true"
                size={18}
                strokeWidth={isActive ? 2 : 1.8}
              />
            </span>

            <span className="min-w-0 flex-1 truncate">
              {title}
            </span>

            {item.badge ? (
              <span className="ms-auto rounded-full bg-sidebar-foreground/[0.08] px-1.5 py-0.5 text-[9px] font-semibold text-sidebar-foreground">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        );
      })}
    </nav>
  );
}

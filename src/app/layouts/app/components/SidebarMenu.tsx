import { NavLink, useLocation } from "react-router-dom";

import { sidebarItems } from "@/app/layouts/app/config/sidebarItems";
import type { SidebarItem } from "@/app/layouts/app/types/sidebar.types";

type SidebarMenuProps = {
  variant: "icons" | "labels";
};

function getBasePath(path: string) {
  if (path === "/") return "/";
  return `/${path.split("/").filter(Boolean)[0]}`;
}

function isItemActive(pathname: string, item: SidebarItem) {
  if (item.exact) return pathname === item.path;
  if (item.path === "/") return pathname === "/";

  const basePath = getBasePath(item.path);

  return pathname === item.path || pathname.startsWith(`${basePath}/`);
}

function getVisibleSidebarItems(items: SidebarItem[]) {
  return items.filter((item) => !item.hidden);
}

export function SidebarMenu({ variant }: SidebarMenuProps) {
  const location = useLocation();
  const visibleItems = getVisibleSidebarItems(sidebarItems);

  if (variant === "icons") {
    return (
<nav className="flex flex-1 flex-col items-center gap-1 pt-3">        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(location.pathname, item);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              title={item.title}
              aria-label={item.title}
              aria-current={active ? "page" : undefined}
              className={[
                "relative flex h-11 w-full items-center justify-center",
                "text-sidebar-foreground/70 transition-all duration-300 ease-out hover:text-white",
                item.disabled ? "pointer-events-none opacity-40" : "",
                active
                  ? "text-white before:absolute before:-left-5 before:top-1/2 before:h-7 before:w-[4px] before:-translate-y-1/2 before:rounded-r-full before:bg-white"
                  : "",
              ].join(" ")}
            >
              <Icon size={18} strokeWidth={2} />
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
<nav className="flex flex-col gap-1 pt-0">      {visibleItems.map((item) => {
        const active = isItemActive(location.pathname, item);

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            aria-current={active ? "page" : undefined}
            className={[
              "relative mx-3 flex h-11 items-center rounded-2xl px-4",
              "text-[13px] font-semibold tracking-[-0.005em] transition-all duration-300 ease-out",
              item.disabled ? "pointer-events-none opacity-40" : "",
            active
  ? "bg-white/12 text-white ring-1 ring-white/12 "
  : "text-sidebar-foreground/75 hover:bg-white/8 hover:text-white"
            ].join(" ")}
          >
            <span className="truncate">{item.title}</span>

            {item.badge ? (
              <span className="ml-auto rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        );
      })}
    </nav>
  );
}
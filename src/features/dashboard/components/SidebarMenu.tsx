import { NavLink, useLocation } from "react-router-dom";

import { sidebarItems } from "../config/sidebarItems";

type SidebarMenuProps = {
  variant: "icons" | "labels";
};

function getBasePath(path: string) {
  if (path === "/") return "/";
  return `/${path.split("/").filter(Boolean)[0]}`;
}

function isItemActive(pathname: string, itemPath: string) {
  if (itemPath === "/") return pathname === "/";

  const basePath = getBasePath(itemPath);

  return pathname === itemPath || pathname.startsWith(`${basePath}/`);
}

export function SidebarMenu({ variant }: SidebarMenuProps) {
  const location = useLocation();

  if (variant === "icons") {
    return (
      <nav className="flex flex-1 flex-col items-center gap-0.5 pt-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(location.pathname, item.path);

          return (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.path === "/"}
              title={item.title}
              className={[
                "relative flex h-10 w-full items-center justify-center",
                "text-white/75 transition-all duration-300 ease-out hover:text-white",
                active
                  ? "text-white before:absolute before:left-[-20px] before:top-1/2 before:h-7 before:w-[4px] before:-translate-y-1/2 before:rounded-r-full before:bg-white"
                  : "hover:before:absolute hover:before:left-[-20px] hover:before:top-1/2 hover:before:h-7 hover:before:w-[4px] hover:before:-translate-y-1/2 hover:before:rounded-r-full hover:before:bg-white/45",
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
    <nav className="flex flex-col gap-0.5 pt-1">
      {sidebarItems.map((item) => {
        const active = isItemActive(location.pathname, item.path);

        return (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.path === "/"}
            className={[
              "relative flex h-10 items-center rounded-l-2xl rounded-r-none px-7",
              "text-[13px] font-semibold transition-all duration-300 ease-out",
              active
                ? "bg-background text-primary shadow-sm"
                : "text-white/80 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            <span className="relative z-10 truncate">{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
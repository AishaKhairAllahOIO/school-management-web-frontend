import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

import { sidebarItems } from "../config/sidebarItems";
import { useLayoutStore } from "../store/layoutStore";

export function SidebarMenu() {
  const openMenus = useLayoutStore((state) => state.openMenus);
  const toggleMenu = useLayoutStore((state) => state.toggleMenu);
  const closeMobileSidebar = useLayoutStore((state) => state.closeMobileSidebar);

  return (
    <nav className="sidebar-scroll flex-1 space-y-2 overflow-y-auto px-4 py-5">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isOpen = openMenus.includes(item.title);

        if (item.children) {
          return (
            <div key={item.title}>
              <button
                type="button"
                onClick={() => toggleMenu(item.title)}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  {item.title}
                </span>

                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="ml-7 mt-1 space-y-1 border-l border-white/15 pl-4">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) =>
                        [
                          "block rounded-xl px-4 py-2 text-sm font-medium transition",
                          isActive
                            ? "bg-white/20 text-white"
                            : "text-white/60 hover:bg-white/10 hover:text-white",
                        ].join(" ")
                      }
                    >
                      {child.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <NavLink
            key={item.path}
            to={item.path ?? "/"}
            end={item.path === "/"}
            onClick={closeMobileSidebar}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
          >
            <Icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}
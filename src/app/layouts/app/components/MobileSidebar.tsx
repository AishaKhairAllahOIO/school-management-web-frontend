import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { SidebarMenu } from "@/app/layouts/app/components/SidebarMenu";
import { useLayoutStore } from "@/app/layouts/app/store/layoutStore";

export function MobileSidebar() {
  const isOpen = useLayoutStore((state) => state.isMobileSidebarOpen);
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);

  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const closeMobileSidebar = useLayoutStore(
    (state) => state.closeMobileSidebar
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={closeMobileSidebar}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <aside
        className={[
          "relative grid h-full overflow-visible rounded-r-3xl sidebar-gradient text-sidebar-foreground shadow-2xl transition-all duration-300",
          isCollapsed
            ? "w-[56px] grid-cols-[56px] grid-rows-[76px_1fr_64px]"
            : "w-[218px] grid-cols-[56px_1fr] grid-rows-[76px_1fr_64px]",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[55px] z-[80] flex h-10 w-3 items-center justify-center rounded-r-full bg-primary/80 text-primary-foreground shadow-md transition-all duration-300 hover:w-4 hover:bg-primary"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <button
          type="button"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
          className="absolute right-3 top-3 z-[90] flex h-8 w-8 items-center justify-center rounded-xl text-sidebar-foreground/70 transition hover:bg-white/10 hover:text-sidebar-foreground"
        >
          <X size={18} />
        </button>

        <div className="row-span-3 flex flex-col items-center rounded-r-3xl bg-white/8">
          <div className="flex h-[76px] items-center justify-center">
            {isCollapsed ? <GraduationCap size={19} /> : null}
          </div>

          <SidebarMenu variant="icons" />

          <div className="flex h-[64px] items-center justify-center">
            {isCollapsed && (
              <NavLink
                to="/logout"
                onClick={closeMobileSidebar}
                title="Log Out"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-sidebar-foreground/80 transition hover:bg-white/15 hover:text-sidebar-foreground"
              >
                <LogOut size={17} />
              </NavLink>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <>
            <div className="flex h-[76px] items-center gap-3 pl-6 pr-10">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                <GraduationCap size={20} />
              </span>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-white">
                  EduCore
                </h1>
                <p className="truncate text-[11px] text-white/60">Academy</p>
              </div>
            </div>

            <div className="min-h-0 overflow-visible px-3">
              <SidebarMenu variant="labels" />
            </div>

            <div className="flex h-[64px] items-center px-3">
              <NavLink
                to="/logout"
                onClick={closeMobileSidebar}
                className="flex h-10 w-full items-center gap-3 rounded-2xl px-3 text-xs font-semibold text-sidebar-foreground/80 transition hover:bg-white/10 hover:text-sidebar-foreground"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </NavLink>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
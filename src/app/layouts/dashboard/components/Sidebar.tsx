import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";

import { SidebarMenu } from "@/app/layouts/dashboard/components/SidebarMenu";
import { useLayoutStore } from "@/app/layouts/dashboard/store/layoutStore";

export function Sidebar() {
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <aside
      className={[
        "fixed left-0 top-0 z-50 hidden h-screen overflow-visible rounded-r-3xl sidebar-gradient text-sidebar-foreground shadow-2xl transition-all duration-300 lg:grid",
        isCollapsed
          ? "w-[56px] grid-cols-[56px] grid-rows-[76px_1fr_64px]"
          : "w-[242px] grid-cols-[56px_1fr] grid-rows-[76px_1fr_64px]",
      ].join(" ")}
    >
      {isCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Expand sidebar"
          className="absolute left-[62px] top-6 z-[80] flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-card text-primary shadow-soft transition duration-300 hover:scale-105 hover:bg-accent"
        >
          <ChevronRight size={15} />
        </button>
      )}

      <div className="row-span-3 flex flex-col items-center rounded-r-3xl bg-white/8">
        <div className="flex h-[76px] items-center justify-center">
          {isCollapsed ? <GraduationCap size={19} /> : null}
        </div>

        <SidebarMenu variant="icons" />
      </div>

      {!isCollapsed && (
        <>
          <div className="flex h-[76px] items-center justify-between gap-3 pl-6 pr-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                <GraduationCap size={24} />
              </span>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-white">
                  EduCore
                </h1>
                <p className="truncate text-[11px] text-white/60">Academy</p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition duration-300 hover:bg-white/15 hover:text-white"
            >
              <ChevronLeft size={15} />
            </button>
          </div>

          <div className="min-h-0 overflow-visible px-3">
            <SidebarMenu variant="labels" />
          </div>
        </>
      )}
    </aside>
  );
}
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";

import { useLayoutStore } from "../store/layoutStore";
import { SidebarMenu } from "./SidebarMenu";

export function Sidebar() {
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <aside
      className={[
        "fixed left-0 top-0 z-50 hidden h-screen overflow-visible rounded-r-[28px] bg-primary text-white shadow-xl transition-all duration-300 lg:grid",
        isCollapsed
          ? "w-[56px] grid-cols-[56px] grid-rows-[76px_1fr_64px]"
          : "w-[218px] grid-cols-[56px_1fr] grid-rows-[76px_1fr_64px]",
      ].join(" ")}
    >
      {isCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Expand sidebar"
          className="absolute left-[62px] top-[24px] z-[80] flex h-8 w-8 items-center justify-center rounded-full bg-card text-primary shadow-soft-lg ring-1 ring-border/70 transition-all duration-300 hover:scale-105 hover:bg-card"
        >
          <ChevronRight size={15} />
        </button>
      )}

      <div className="row-span-3 flex flex-col items-center rounded-r-[28px] bg-primary-light/55">
        <div className="flex h-[76px] items-center justify-center">
          {isCollapsed ? <GraduationCap size={19} /> : null}
        </div>

        <SidebarMenu variant="icons" />
      </div>

      {!isCollapsed && (
        <>
          <div className="flex h-[76px] items-center justify-between gap-3 pl-6 pr-4">
            <div className="flex min-w-0 items-center gap-3">
              <GraduationCap size={30} className="shrink-0 text-white/85" />

              <h1 className="truncate text-sm font-bold">School</h1>
            </div>

            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/15 hover:text-white"
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
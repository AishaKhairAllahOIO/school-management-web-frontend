import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
} from "lucide-react";

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
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-[12px] top-[55px] z-[80] flex h-10 w-[12px] items-center justify-center rounded-r-full bg-primary-light/80 text-white shadow-md transition-all duration-300 hover:w-[16px] hover:bg-primary-light"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className="row-span-3 flex flex-col items-center rounded-r-[28px] bg-primary-light/55">
        <div className="flex h-[76px] items-center justify-center">
          {isCollapsed ? <GraduationCap size={19} /> : null}
        </div>

        <SidebarMenu variant="icons" />

        <div className="flex h-[64px] items-center justify-center">
          {isCollapsed ? (
            <button
              type="button"
              title="Log Out"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <LogOut size={17} />
            </button>
          ) : null}
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="flex h-[76px] items-center gap-3 pl-6">
            <GraduationCap size={18} className="text-white/85" />
            <h1 className="text-sm font-bold">School</h1>
          </div>

          <div className="min-h-0 overflow-visible px-3">
            <SidebarMenu variant="labels" />
          </div>

          <div className="flex h-[64px] items-center gap-3 pl-6">
            <LogOut size={16} className="text-white/80" />
            <span className="text-xs font-medium text-white/80">Log Out</span>
          </div>
        </>
      )}
    </aside>
  );
}
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useLayoutStore } from "../store/layoutStore";
import { SidebarMenu } from "./SidebarMenu";

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
          "relative grid h-full overflow-visible rounded-r-[28px] bg-primary text-white shadow-2xl transition-all duration-300",
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

        <button
          type="button"
          onClick={closeMobileSidebar}
          className="absolute right-3 top-3 z-[90] flex h-8 w-8 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="row-span-3 flex flex-col items-center rounded-r-[28px] bg-primary-light/55">
          <div className="flex h-[76px] items-center justify-center">
            {isCollapsed ? <GraduationCap size={19} /> : null}
          </div>

          <SidebarMenu variant="icons" />

          <div className="flex h-[64px] items-center justify-center">
            {isCollapsed ? (
              <NavLink
                to="/logout"
                onClick={closeMobileSidebar}
                title="Log Out"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                <LogOut size={17} />
              </NavLink>
            ) : null}
          </div>
        </div>

        {!isCollapsed && (
          <>
            <div className="flex h-[76px] items-center gap-3 pl-6 pr-10">
              <GraduationCap size={18} className="text-white/85" />
              <h1 className="text-sm font-bold">School</h1>
            </div>

            <div className="min-h-0 overflow-visible px-3">
              <SidebarMenu variant="labels" />
            </div>

            <div className="flex h-[64px] items-center gap-3 pl-6">
              <LogOut size={16} className="text-white/80" />

              <NavLink
  to="/logout"
  onClick={closeMobileSidebar}
  className="flex items-center gap-3 text-xs font-medium text-white/80 transition hover:text-white"
>
  <LogOut size={16} />
  {!isCollapsed && <span>Log Out</span>}
</NavLink>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
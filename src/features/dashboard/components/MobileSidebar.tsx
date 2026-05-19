import { GraduationCap, LogOut, X } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useLayoutStore } from "../store/layoutStore";
import { SidebarMenu } from "./SidebarMenu";

export function MobileSidebar() {
  const isOpen = useLayoutStore((state) => state.isMobileSidebarOpen);

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

      <aside className="relative flex h-full w-[260px] max-w-[85vw] flex-col overflow-hidden rounded-r-[28px] bg-primary text-white shadow-2xl">
        <div className="flex h-[76px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <GraduationCap size={20} className="text-white/90" />

            <div>
              <h1 className="text-sm font-bold">School</h1>

              <p className="text-[11px] text-white/60">
                Management System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3">
          <SidebarMenu variant="labels" />
        </div>

        <div className="flex h-[64px] items-center gap-3 px-6">
          <LogOut size={16} className="text-white/80" />

          <NavLink
            to="/logout"
            onClick={closeMobileSidebar}
            className="text-xs font-medium text-white/80 transition hover:text-white"
          >
            Log Out
          </NavLink>
        </div>
      </aside>
    </div>
  );
}
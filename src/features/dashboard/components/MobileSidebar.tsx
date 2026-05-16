import { X, GraduationCap } from "lucide-react";

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
        className="absolute inset-0 bg-black/40"
      />

      <aside className="relative flex h-full w-80 max-w-[85vw] flex-col bg-primary text-white shadow-2xl">
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-xl font-bold">School Desk</h1>
              <p className="text-xs text-white/70">Management System</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <SidebarMenu />
      </aside>
    </div>
  );
}
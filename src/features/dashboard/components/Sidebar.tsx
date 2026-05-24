import {
  Bot,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import { useLayoutStore } from "../store/layoutStore";
import { SidebarMenu } from "./SidebarMenu";

function AiAssistantDock() {
  return (
    <button
      type="button"
      className="fixed bottom-6 left-[76px] z-[9999] hidden w-[126px] rounded-[24px] border border-white/20 bg-primary-light p-3 text-left text-white shadow-2xl transition hover:scale-[1.02] hover:bg-primary-light lg:block"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-primary">
          <Bot size={18} />
        </span>

        <span className="min-w-0">
          <span className="block truncate text-xs font-bold">Aisha AI</span>

          <span className="flex items-center gap-1 text-[10px] text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Online
          </span>
        </span>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-[11px] font-bold text-primary">
        Ask me
        <Sparkles size={13} />
      </div>
    </button>
  );
}

export function Sidebar() {
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <>
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

      {!isCollapsed && <AiAssistantDock />}
    </>
  );
}
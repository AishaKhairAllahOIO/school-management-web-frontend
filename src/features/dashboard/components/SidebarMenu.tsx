import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";

import { useLayoutStore } from "../store/layoutStore";
import { SidebarMenu } from "./SidebarMenu";

function AiAssistantDock() {
  return (
    <div className="relative mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
      <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-10 right-0 h-24 w-24 rounded-full bg-primary-light/40 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 shadow-lg">
            <span className="text-xl">🤖</span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Aisha AI</h3>

            <p className="text-[11px] text-white/65">Smart Assistant</p>
          </div>
        </div>

        <p className="mb-4 text-[12px] leading-5 text-white/75">
          Ready to help you manage students, schedules, and reports faster.
        </p>

        <button
          type="button"
          className="w-full rounded-2xl bg-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
        >
          Ask Assistant
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <aside
      className={[
        "fixed left-0 top-0 z-50 hidden h-screen overflow-visible rounded-r-[28px] bg-primary text-white shadow-xl transition-all duration-300 lg:grid",
        isCollapsed
          ? "w-[56px] grid-cols-[56px] grid-rows-[76px_1fr_150px]"
          : "w-[218px] grid-cols-[56px_1fr] grid-rows-[76px_1fr_170px]",
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

          <div className="flex min-h-0 flex-col overflow-hidden px-3 pb-4">
            <div className="flex-1 overflow-visible">
              <SidebarMenu variant="labels" />
            </div>

            <AiAssistantDock />
          </div>
        </>
      )}
    </aside>
  );
}
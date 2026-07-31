import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

import { SidebarMenu } from "@/app/layouts/components/SidebarMenu";
import { useLayoutStore } from "@/app/layouts/store/layoutStore";
import { useLocale } from "@/app/providers/locale";

export function Sidebar() {
  const isCollapsed = useLayoutStore(
    (state) => state.isSidebarCollapsed,
  );

  const toggleSidebar = useLayoutStore(
    (state) => state.toggleSidebar,
  );

  const { direction, t } = useLocale();

  const isRtl = direction === "rtl";

  const sidebarPositionClass = isRtl
    ? "right-0 rounded-l-[26px]"
    : "left-0 rounded-r-[26px]";

  const sidebarRadiusClass = isRtl
    ? "rounded-l-[26px]"
    : "rounded-r-[26px]";

  const collapseIcon = isRtl ? (
    <ChevronRight size={14} strokeWidth={2} />
  ) : (
    <ChevronLeft size={14} strokeWidth={2} />
  );

  const expandIcon = isRtl ? (
    <ChevronLeft size={14} strokeWidth={2} />
  ) : (
    <ChevronRight size={14} strokeWidth={2} />
  );

  return (
    <aside
      className={[
        "sidebar-gradient sidebar-shell",
        "fixed top-0 z-50 hidden h-screen overflow-visible",
        "text-sidebar-foreground",
        "transition-[width] duration-300 ease-out",
        "lg:flex lg:flex-col",
        sidebarPositionClass,
        isCollapsed ? "w-[70px]" : "w-[248px]",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          "z-0 overflow-hidden",
          sidebarRadiusClass,
        ].join(" ")}
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <header
          className={[
            "relative flex shrink-0 items-center",
            isCollapsed
              ? "h-[76px] justify-center px-2.5"
              : "h-[82px] px-4 pe-9",
          ].join(" ")}
        >
          {isCollapsed ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-[15px] border border-sidebar-foreground/10 bg-sidebar-foreground/[0.08]">
              <GraduationCap
                aria-hidden="true"
                size={21}
                strokeWidth={1.8}
              />
            </div>
          ) : (
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] border border-sidebar-foreground/10 bg-sidebar-foreground/[0.08]">
                <GraduationCap
                  aria-hidden="true"
                  size={21}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="sidebar-brand-title">
                  School Management
                </h1>

                <p className="sidebar-brand-subtitle mt-1">
                  Administration Platform
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={
              isCollapsed
                ? t.layout.sidebar.expandSidebar
                : t.layout.sidebar.collapseSidebar
            }
            className="absolute end-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-sidebar-foreground/45 transition hover:bg-sidebar-foreground/[0.08] hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-foreground/20"
          >
            {isCollapsed ? expandIcon : collapseIcon}
          </button>
        </header>

        <div
          className={[
            "min-h-0 flex-1 overflow-y-auto",
            isCollapsed ? "px-2 pt-0.5" : "px-3 pt-0",
          ].join(" ")}
        >
          {!isCollapsed ? (
            <div className="mb-2.5 flex items-center gap-3 px-2">
              <span className="text-[9px] font-semibold uppercase leading-none tracking-[0.14em] text-sidebar-muted/68">
                Main menu
              </span>

              <span className="h-px flex-1 bg-sidebar-foreground/[0.07]" />
            </div>
          ) : (
            <div className="mb-2 h-px bg-sidebar-foreground/[0.05]" />
          )}

          <SidebarMenu variant={isCollapsed ? "icons" : "labels"} />
        </div>
      </div>
    </aside>
  );
}

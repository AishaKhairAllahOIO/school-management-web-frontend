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
    ? "right-0 rounded-l-3xl"
    : "left-0 rounded-r-3xl";

  const sidebarRadiusClass = isRtl
    ? "rounded-l-3xl"
    : "rounded-r-3xl";

  const togglePositionClass = isRtl
    ? "-left-4"
    : "-right-4";

  const collapseIcon = isRtl ? (
    <ChevronRight
      aria-hidden="true"
      size={16}
      strokeWidth={2}
    />
  ) : (
    <ChevronLeft
      aria-hidden="true"
      size={16}
      strokeWidth={2}
    />
  );

  const expandIcon = isRtl ? (
    <ChevronLeft
      aria-hidden="true"
      size={16}
      strokeWidth={2}
    />
  ) : (
    <ChevronRight
      aria-hidden="true"
      size={16}
      strokeWidth={2}
    />
  );

  return (
    <aside
      className={[
        "sidebar-gradient sidebar-shell",
        "fixed top-0 z-50 hidden h-screen overflow-visible",
        "text-sidebar-foreground",
        "transition-[width] duration-300 ease-out",
        "motion-reduce:transition-none",
        "lg:flex lg:flex-col",
        sidebarPositionClass,
        isCollapsed
          ? "w-[76px]"
          : "w-[264px]",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 z-0 overflow-hidden",
          sidebarRadiusClass,
        ].join(" ")}
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <header
          className={[
            "relative flex h-[92px] shrink-0 items-center",
            isCollapsed
              ? "justify-center px-3"
              : "px-4",
          ].join(" ")}
        >
          {isCollapsed ? (
            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center",
                "rounded-2xl",
                "border border-sidebar-foreground/10",
                "bg-sidebar-foreground/10",
                "shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
              ].join(" ")}
            >
              <GraduationCap
                aria-hidden="true"
                size={24}
                strokeWidth={1.8}
                className="shrink-0 text-sidebar-foreground"
              />
            </div>
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center",
                  "rounded-2xl",
                  "border border-sidebar-foreground/10",
                  "bg-sidebar-foreground/10",
                  "shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
                ].join(" ")}
              >
                <GraduationCap
                  aria-hidden="true"
                  size={24}
                  strokeWidth={1.8}
                  className="shrink-0 text-sidebar-foreground"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-[15px] font-semibold leading-5 tracking-[-0.015em] text-sidebar-foreground">
                  School Management
                </h1>

                <p className="mt-0.5 truncate text-[10px] font-medium leading-4 tracking-[0.01em] text-sidebar-muted">
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
            className={[
              "absolute top-1/2 z-20 -translate-y-1/2",
              togglePositionClass,
              "flex h-8 w-8 shrink-0 items-center justify-center",
              "rounded-full",
              "border border-sidebar-foreground/15",
              "bg-sidebar/95",
              "text-sidebar-foreground/75",
              "shadow-[0_6px_18px_rgba(0,0,0,0.18)]",
              "transition-colors duration-200",
              "hover:bg-sidebar-foreground/10",
              "hover:text-sidebar-foreground",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-sidebar-foreground/25",
              "motion-reduce:transition-none",
            ].join(" ")}
          >
            {isCollapsed
              ? expandIcon
              : collapseIcon}
          </button>
        </header>

        <div
          className={[
            "min-h-0 flex-1 overflow-y-auto overflow-x-hidden",
            isCollapsed
              ? "px-2 pt-3"
              : "px-4 pt-2",
          ].join(" ")}
        >
          {!isCollapsed ? (
            <div className="mb-3 flex items-center gap-3 px-3">
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-muted/80">
                Main menu
              </span>

              <span className="h-px flex-1 bg-sidebar-foreground/[0.08]" />
            </div>
          ) : (
            <div className="mb-3 h-px w-full bg-sidebar-foreground/[0.06]" />
          )}

          <SidebarMenu
            variant={
              isCollapsed
                ? "icons"
                : "labels"
            }
          />
        </div>
      </div>
    </aside>
  );
}
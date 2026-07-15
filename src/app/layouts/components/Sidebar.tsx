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

  const collapsedTogglePositionClass = isRtl
    ? "right-[62px]"
    : "left-[62px]";

  const collapseButtonPositionClass = isRtl
    ? "left-3"
    : "right-3";

  const titlePaddingClass = isRtl
    ? "pl-11 pr-3"
    : "pl-3 pr-11";

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
        "transition-all duration-300 ease-out",
        "motion-reduce:transition-none",
        "lg:grid",
        sidebarPositionClass,
        isCollapsed
          ? [
              "w-[56px]",
              "grid-cols-[56px]",
              "grid-rows-[76px_1fr_64px]",
            ].join(" ")
          : [
              "w-[242px]",
              "grid-cols-[56px_1fr]",
              "grid-rows-[76px_1fr_auto]",
            ].join(" "),
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 z-0 overflow-hidden",
          sidebarRadiusClass,
        ].join(" ")}
      />

      {isCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={t.layout.sidebar.expandSidebar}
          className={[
            "absolute top-6 z-[100]",
            collapsedTogglePositionClass,
            "flex h-8 w-8 items-center justify-center",
            "text-primary",
            "transition-colors duration-200",
            "hover:text-primary/80",
            "focus-visible:outline-none",
            "focus-visible:text-primary/80",
            "motion-reduce:transition-none",
          ].join(" ")}
        >
          {expandIcon}
        </button>
      )}

      <div
        className={[
          "relative z-10 row-span-3",
          "flex min-h-0 flex-col items-center",
          "bg-sidebar-foreground/5",
          sidebarRadiusClass,
        ].join(" ")}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center">
            <GraduationCap
              aria-hidden="true"
              size={27}
              strokeWidth={1.8}
              className="text-sidebar-foreground"
            />
          </div>
        </div>

        <SidebarMenu variant="icons" />
      </div>

      {!isCollapsed && (
        <>
          <header
            className={[
              "relative z-10 h-[76px]",
              "border-b border-sidebar-foreground/20",
            ].join(" ")}
          >
            <div
              className={[
                "flex h-full items-center justify-center",
                titlePaddingClass,
              ].join(" ")}
            >
              <h1 className="min-w-0 text-center text-sidebar-foreground">
                <span
                  className={[
                    "block whitespace-nowrap",
                    "text-[13px] font-medium",
                    "leading-none tracking-[0.035em]",
                  ].join(" ")}
                >
                  School Management
                </span>

                <span
                  className={[
                    "mt-1.5 block",
                    "text-[13px] font-medium",
                    "leading-none tracking-[0.035em]",
                  ].join(" ")}
                >
                  System
                </span>
              </h1>
            </div>

            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={t.layout.sidebar.collapseSidebar}
              className={[
                "absolute top-1/2 -translate-y-1/2",
                collapseButtonPositionClass,
                "flex h-8 w-8 items-center justify-center",
                "text-sidebar-foreground",
                "transition-colors duration-200",
                "hover:text-sidebar-foreground/80",
                "focus-visible:outline-none",
                "focus-visible:text-sidebar-foreground/80",
                "motion-reduce:transition-none",
              ].join(" ")}
            >
              {collapseIcon}
            </button>
          </header>

          <div className="relative z-10 min-h-0 overflow-visible px-3 pt-3">
            <SidebarMenu variant="labels" />
          </div>
        </>
      )}
    </aside>
  );
}
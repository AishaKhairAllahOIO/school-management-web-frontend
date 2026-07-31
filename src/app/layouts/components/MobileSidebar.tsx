import {
  GraduationCap,
  X,
} from "lucide-react";

import { SidebarMenu } from "@/app/layouts/components/SidebarMenu";
import { useLayoutStore } from "@/app/layouts/store/layoutStore";
import { useLocale } from "@/app/providers/locale";

export function MobileSidebar() {
  const isOpen = useLayoutStore(
    (state) => state.isMobileSidebarOpen,
  );

  const closeMobileSidebar = useLayoutStore(
    (state) => state.closeMobileSidebar,
  );

  const { direction, t } = useLocale();

  const isRtl = direction === "rtl";

  const sidebarPositionClass = isRtl
    ? "right-0 rounded-l-[26px]"
    : "left-0 rounded-r-[26px]";

  const sidebarRadiusClass = isRtl
    ? "rounded-l-[26px]"
    : "rounded-r-[26px]";

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label={t.layout.sidebar.closeSidebar}
        onClick={closeMobileSidebar}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
      />

      <aside
        aria-label={t.layout.sidebar.navigation}
        className={[
          "sidebar-gradient sidebar-shell",
          "absolute top-0 z-10",
          "flex h-full w-[248px] max-w-[84vw] flex-col",
          "overflow-visible",
          "text-sidebar-foreground",
          sidebarPositionClass,
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
          <header className="relative flex h-[82px] shrink-0 items-center px-4 pe-11">
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

            <button
              type="button"
              onClick={closeMobileSidebar}
              aria-label={t.layout.sidebar.closeSidebar}
              className="absolute end-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-sidebar-foreground/50 transition hover:bg-sidebar-foreground/[0.08] hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-foreground/25"
            >
              <X
                aria-hidden="true"
                size={16}
                strokeWidth={2}
              />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-0">
            <div className="mb-2.5 flex items-center gap-3 px-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted/70">
                Main menu
              </span>

              <span className="h-px flex-1 bg-sidebar-foreground/[0.07]" />
            </div>

            <SidebarMenu
              variant="labels"
              onNavigate={closeMobileSidebar}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

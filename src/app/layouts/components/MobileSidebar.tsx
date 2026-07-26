import {
  GraduationCap,
  X,
} from "lucide-react";

import { SidebarMenu } from "@/app/layouts/components/SidebarMenu";
import { useLayoutStore } from "@/app/layouts/store/layoutStore";
import { useLocale } from "@/app/providers/locale";

export function MobileSidebar() {
  const isOpen = useLayoutStore(
    (state) =>
      state.isMobileSidebarOpen,
  );

  const closeMobileSidebar =
    useLayoutStore(
      (state) =>
        state.closeMobileSidebar,
    );

  const { direction, t } = useLocale();

  const isRtl = direction === "rtl";

  const sidebarPositionClass = isRtl
    ? "right-0 rounded-l-3xl"
    : "left-0 rounded-r-3xl";

  const sidebarRadiusClass = isRtl
    ? "rounded-l-3xl"
    : "rounded-r-3xl";

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label={
          t.layout.sidebar.closeSidebar
        }
        onClick={closeMobileSidebar}
        className="
          absolute
          inset-0
          bg-foreground/45
          backdrop-blur-[2px]
        "
      />

      <aside
        aria-label={
          t.layout.sidebar.navigation
        }
        className={[
          "sidebar-gradient sidebar-shell",
          "absolute top-0 z-10",
          "flex h-full w-[248px] max-w-[86vw] flex-col",
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

        <div
          className="
            relative
            z-10
            flex
            h-full
            min-h-0
            flex-col
          "
        >
          <header
            className="
              relative
              flex
              h-[82px]
              shrink-0
              items-center
              px-4
              pe-12
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-2.5
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-sidebar-foreground/10
                  bg-sidebar-foreground/10
                "
              >
                <GraduationCap
                  aria-hidden="true"
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <h1
                  className="
                    truncate
                    text-[14px]
                    font-semibold
                    leading-5
                  "
                >
                  School Management
                </h1>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[10px]
                    font-medium
                    text-sidebar-muted
                  "
                >
                  Administration Platform
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeMobileSidebar}
              aria-label={
                t.layout.sidebar.closeSidebar
              }
              className="
                absolute
                end-3
                top-1/2
                flex
                h-7
                w-7
                -translate-y-1/2
                items-center
                justify-center
                rounded-lg
                text-sidebar-foreground/60
                transition
                hover:bg-sidebar-foreground/[0.08]
                hover:text-sidebar-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-sidebar-foreground/30
              "
            >
              <X
                aria-hidden="true"
                size={16}
                strokeWidth={2}
              />
            </button>
          </header>

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-3
              pt-0
            "
          >
            <div
              className="
                mb-2
                flex
                items-center
                gap-3
                px-2
              "
            >
              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-sidebar-muted/80
                "
              >
                Main menu
              </span>

              <span
                className="
                  h-px
                  flex-1
                  bg-sidebar-foreground/[0.08]
                "
              />
            </div>

            <SidebarMenu
              variant="labels"
              onNavigate={
                closeMobileSidebar
              }
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
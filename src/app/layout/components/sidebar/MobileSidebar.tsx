import {
  CalendarDays,
  Sparkles,
  X,
} from "lucide-react";

import { SidebarMenu } from "@/app/layout/components/sidebar/SidebarMenu";
import { useLayoutStore } from "@/app/layout/store/layoutStore";
import { useLocale } from "@/app/providers/locale";

function formatMobileSidebarDate(locale: string) {
  const today = new Date();

  return {
    day: new Intl.DateTimeFormat(locale, {
      day: "2-digit",
    }).format(today),
    month: new Intl.DateTimeFormat(locale, {
      month: "short",
    }).format(today),
    weekday: new Intl.DateTimeFormat(locale, {
      weekday: "long",
    }).format(today),
  };
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function MobileSidebar() {
  const isOpen = useLayoutStore(
    (state) => state.isMobileSidebarOpen,
  );

  const closeMobileSidebar = useLayoutStore(
    (state) => state.closeMobileSidebar,
  );

  const { direction, locale, t } = useLocale();

  const isRtl = direction === "rtl";
  const date = formatMobileSidebarDate(locale);
  const greeting = getGreeting();

  const sidebarPositionClass = isRtl
    ? "right-0 rounded-l-[28px]"
    : "left-0 rounded-r-[28px]";

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label={t.layout.sidebar.closeSidebar}
        onClick={closeMobileSidebar}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[3px]"
      />

      <aside
        aria-label={t.layout.sidebar.navigation}
        className={[
          "sidebar-gradient sidebar-shell",
          "absolute top-0 z-10",
          "flex h-full w-[264px] max-w-[86vw] flex-col",
          "overflow-hidden text-sidebar-foreground",
          sidebarPositionClass,
        ].join(" ")}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -start-20 -top-24 h-64 w-64 rounded-full bg-sidebar-active/18 blur-[90px]" />
          <div className="absolute -bottom-28 -end-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <header className="relative h-[136px] shrink-0 px-4 pt-5">
            <div className="relative h-full overflow-hidden rounded-[22px] border border-sidebar-foreground/[0.075] bg-sidebar-foreground/[0.045] px-4 pb-4 pt-4 shadow-[0_14px_34px_rgb(0_0_0_/_0.12)] backdrop-blur-xl">
              <div
                aria-hidden="true"
                className="absolute -end-10 -top-12 h-28 w-28 rounded-full bg-sidebar-active/16 blur-3xl"
              />

              <button
                type="button"
                onClick={closeMobileSidebar}
                aria-label={t.layout.sidebar.closeSidebar}
                className="absolute end-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-[11px] border border-sidebar-foreground/[0.085] bg-sidebar-foreground/[0.055] text-sidebar-muted transition hover:bg-sidebar-foreground/[0.11] hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-foreground/25"
              >
                <X
                  aria-hidden="true"
                  size={16}
                  strokeWidth={2}
                />
              </button>

              <div className="relative pe-10">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-sidebar-muted/80">
                  <Sparkles
                    aria-hidden="true"
                    size={12}
                    strokeWidth={1.9}
                  />
                  <span>{greeting}</span>
                </div>

                <h1 className="mt-2 text-[15px] font-semibold leading-[19px] tracking-[-0.02em] text-sidebar-foreground">
                  School Management
                </h1>

                <div className="mt-3 flex items-center gap-2 text-[10px] text-sidebar-muted/78">
                  <CalendarDays
                    aria-hidden="true"
                    size={12}
                    strokeWidth={1.8}
                  />
                  <span className="truncate">
                    {date.weekday} · {date.month} {date.day}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3.5">
            <div className="mb-2 mt-2 flex h-5 shrink-0 items-center gap-3 px-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-sidebar-muted/58">
                Main menu
              </span>
              <span className="relative -top-[2px] h-px flex-1 bg-sidebar-foreground/[0.055]" />
            </div>

            <div className="shrink-0">
              <SidebarMenu
                variant="labels"
                onNavigate={closeMobileSidebar}
              />
            </div>

            <div className="flex-1" />
          </div>
        </div>
      </aside>
    </div>
  );
}

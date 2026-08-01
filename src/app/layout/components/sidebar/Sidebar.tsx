import {
  CalendarDays,
  Globe2,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";

import { SidebarMenu } from "@/app/layout/components/sidebar/SidebarMenu";
import { useLayoutStore } from "@/app/layout/store/layoutStore";
import { useLocale } from "@/app/providers/locale";

const WEBSITE_URL =
  "https://your-school-website.com";

function formatSidebarDate(locale: string) {
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

export function Sidebar() {
  const isCollapsed = useLayoutStore(
    (state) => state.isSidebarCollapsed,
  );

  const toggleSidebar = useLayoutStore(
    (state) => state.toggleSidebar,
  );

  const { direction, locale, t } =
    useLocale();

  const isRtl = direction === "rtl";

  const date = formatSidebarDate(locale);
  const greeting = getGreeting();

  const sidebarPositionClass = isRtl
    ? "right-0 rounded-l-[28px]"
    : "left-0 rounded-r-[28px]";

  /*
   * تحريك كتلة الهيدر قليلًا نحو بداية السايد بار،
   * مع إبقاء المحتوى الداخلي متمركزًا حول العنوان.
   */
  const workspacePositionClass = isRtl
    ? "translate-x-[14px]"
    : "-translate-x-[14px]";

  return (
    <aside
      className={[
        "sidebar-gradient sidebar-shell",
        "fixed top-0 z-50 hidden h-screen overflow-hidden",
        "text-sidebar-foreground",
        "transition-[width] duration-300 ease-out",
        "lg:flex lg:flex-col",
        sidebarPositionClass,
        isCollapsed
          ? "w-[70px]"
          : "w-[248px]",
      ].join(" ")}
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -start-20
            -top-24
            h-64
            w-64
            rounded-full
            bg-sidebar-active/18
            blur-[90px]
          "
        />

        <div
          className="
            absolute
            -bottom-28
            -end-20
            h-64
            w-64
            rounded-full
            bg-primary/10
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            inset-y-0
            end-0
            w-px
            bg-sidebar-foreground/[0.06]
          "
        />
      </div>

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
        {isCollapsed ? (
          <header
            className="
              flex
              h-[104px]
              shrink-0
              items-center
              justify-center
              px-2
            "
          >
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={
                t.layout.sidebar.expandSidebar
              }
              title={
                t.layout.sidebar.expandSidebar
              }
              className={[
                "flex h-[42px] w-[42px]",
                "items-center justify-center",
                "rounded-[14px]",
                "border border-sidebar-foreground/[0.10]",
                "bg-sidebar-foreground/[0.07]",
                "text-sidebar-foreground",
                "shadow-[0_8px_22px_rgb(0_0_0_/_0.14)]",
                "backdrop-blur-xl",
                "transition-all duration-200",
                "hover:-translate-y-0.5",
                "hover:bg-sidebar-foreground/[0.12]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-sidebar-foreground/25",
              ].join(" ")}
            >
              <PanelLeftOpen
                aria-hidden="true"
                size={18}
                strokeWidth={1.9}
                className={
                  isRtl ? "rotate-180" : ""
                }
              />
            </button>
          </header>
        ) : (
          <header
            className="
              relative
              flex
              h-[104px]
              shrink-0
              items-center
              justify-center
              px-4
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                -end-10
                -top-12
                h-28
                w-28
                rounded-full
                bg-sidebar-active/14
                blur-3xl
              "
            />

            {/* Workspace information */}
            <div
              className={[
                "flex min-w-0 flex-col",
                "items-center text-center",
                workspacePositionClass,
              ].join(" ")}
            >
              {/* Greeting centered above title */}
              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  text-[10px]
                  font-medium
                  leading-[13px]
                  text-sidebar-muted/78
                "
              >
                <Sparkles
                  aria-hidden="true"
                  size={11}
                  strokeWidth={1.9}
                />

                <span className="whitespace-nowrap">
                  {greeting}
                </span>
              </div>

              <h1
                className="
                  mt-[5px]
                  whitespace-nowrap
                  text-[17px]
                  font-semibold
                  leading-[19px]
                  tracking-[-0.02em]
                  text-sidebar-foreground
                "
              >
                School Management
              </h1>

              {/* Date centered below title */}
              <div
                className="
                  mt-[6px]
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  text-[10px]
                  leading-[13px]
                  text-sidebar-muted/72
                "
              >
                <CalendarDays
                  aria-hidden="true"
                  size={11}
                  strokeWidth={1.8}
                />

                <span className="whitespace-nowrap">
                  {date.weekday} · {date.month}{" "}
                  {date.day}
                </span>
              </div>
            </div>

            {/* Collapse control */}
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={
                t.layout.sidebar.collapseSidebar
              }
              title={
                t.layout.sidebar.collapseSidebar
              }
              className={[
                "absolute end-4 top-1/2",
                "-translate-y-1/2",
                "flex h-[38px] w-[38px]",
                "items-center justify-center",
                "rounded-[13px]",
                "text-sidebar-muted",
                "transition-all duration-200",
                "hover:bg-sidebar-foreground/[0.055]",
                "hover:text-sidebar-foreground",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-sidebar-foreground/25",
              ].join(" ")}
            >
              <PanelLeftClose
                aria-hidden="true"
                size={17}
                strokeWidth={1.9}
                className={
                  isRtl ? "rotate-180" : ""
                }
              />
            </button>
          </header>
        )}

        <div
          className={[
            "flex min-h-0 flex-1 flex-col",
            "overflow-hidden",
            isCollapsed
              ? "px-2"
              : "px-3.5",
          ].join(" ")}
        >
          {!isCollapsed && (
            <div
              className="
                -mt-[7px]
                mb-[5px]
                flex
                h-6
                shrink-0
                items-center
                gap-3
                px-2
              "
            >
              <span
                className="
                  shrink-0
                  text-[9px]
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[0.15em]
                  text-sidebar-muted/58
                "
              >
                Main menu
              </span>

              <span
                className="
                  relative
                  -top-[3px]
                  h-px
                  flex-1
                  bg-sidebar-foreground/[0.055]
                "
              />
            </div>
          )}

          <div className="shrink-0">
            <SidebarMenu
              variant={
                isCollapsed
                  ? "icons"
                  : "labels"
              }
            />
          </div>

          {/* Push View Website to the bottom */}
          <div className="min-h-4 flex-1" />

          {/* Premium website card */}
          <div
            className={[
              "shrink-0",
              /*
               * رفع البطاقة عن أسفل السايد بار:
               * زِد القيمة إلى pb-10 إذا أردتها أعلى أكثر.
               */
              "pb-8",
              isCollapsed ? "px-0" : "px-0.5",
            ].join(" ")}
          >
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View website"
              title="View website"
              className={[
                "group relative flex overflow-hidden",
                "items-center",
                "border border-sidebar-foreground/[0.11]",
                "bg-gradient-to-br",
                "from-sidebar-foreground/[0.085]",
                "via-sidebar-foreground/[0.045]",
                "to-sidebar-active/[0.085]",
                "text-sidebar-muted",
                "shadow-[0_14px_36px_rgb(0_0_0_/_0.16)]",
                "backdrop-blur-2xl",
                "transition-all duration-300 ease-out",
                "before:pointer-events-none",
                "before:absolute before:inset-x-3",
                "before:top-0 before:h-px",
                "before:bg-gradient-to-r",
                "before:from-transparent",
                "before:via-sidebar-foreground/30",
                "before:to-transparent",
                "after:pointer-events-none",
                "after:absolute after:-end-6 after:-top-8",
                "after:h-20 after:w-20",
                "after:rounded-full",
                "after:bg-sidebar-active/15",
                "after:blur-2xl",
                "hover:-translate-y-1",
                "hover:border-sidebar-foreground/[0.20]",
                "hover:from-sidebar-foreground/[0.12]",
                "hover:via-sidebar-foreground/[0.07]",
                "hover:to-sidebar-active/[0.13]",
                "hover:text-sidebar-foreground",
                "hover:shadow-[0_18px_42px_rgb(0_0_0_/_0.22)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-sidebar-foreground/25",
                isCollapsed
                  ? [
                      "h-[46px] w-[46px]",
                      "justify-center",
                      "rounded-[15px]",
                    ].join(" ")
                  : [
                      "h-[52px] w-full",
                      "justify-start",
                      "rounded-[17px]",
                      "px-3",
                    ].join(" "),
              ].join(" ")}
            >
              {/* Single website icon */}
              <span
                className={[
                  "relative z-10",
                  "flex shrink-0 items-center justify-center",
                  "rounded-[12px]",
                  "border border-sidebar-foreground/[0.08]",
                  "bg-sidebar-foreground/[0.09]",
                  "text-sidebar-foreground/90",
                  "shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08)]",
                  "transition-all duration-300",
                  "group-hover:scale-[1.04]",
                  "group-hover:bg-sidebar-foreground/[0.14]",
                  "group-hover:text-sidebar-foreground",
                  isCollapsed
                    ? "h-8 w-8"
                    : "h-[34px] w-[34px]",
                ].join(" ")}
              >
                <Globe2
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.85}
                />
              </span>

              {!isCollapsed && (
                <span
                  className="
                    relative
                    z-10
                    ms-3
                    min-w-0
                    flex-1
                    truncate
                    text-start
                    text-[13px]
                    font-medium
                    tracking-[-0.01em]
                  "
                >
                  View Website
                </span>
              )}
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
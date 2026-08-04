import {
  CalendarDays,
  Globe2,
  PanelLeftClose,
  Sparkles,
} from "lucide-react";

import { SidebarMenu } from "@/app/layout/components/sidebar/SidebarMenu";
import { SidebarSectionSeparator } from "@/app/layout/components/sidebar/SidebarSectionSeparator";
import { useLayoutStore } from "@/app/layout/store/layoutStore";
import { useLocale } from "@/app/providers/locale";

const WEBSITE_URL =
  "https://your-school-website.com";

function formatMobileSidebarDate(
  locale: string,
) {
  const today = new Date();

  return {
    day: new Intl.DateTimeFormat(
      locale,
      {
        day: "2-digit",
      },
    ).format(today),

    month: new Intl.DateTimeFormat(
      locale,
      {
        month: "short",
      },
    ).format(today),

    weekday: new Intl.DateTimeFormat(
      locale,
      {
        weekday: "long",
      },
    ).format(today),
  };
}

function getGreetingKey() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "goodMorning" as const;
  }

  if (hour < 18) {
    return "goodAfternoon" as const;
  }

  return "goodEvening" as const;
}

export function MobileSidebar() {
  const isOpen =
    useLayoutStore(
      (state) =>
        state.isMobileSidebarOpen,
    );

  const closeMobileSidebar =
    useLayoutStore(
      (state) =>
        state.closeMobileSidebar,
    );

  const {
    direction,
    locale,
    t,
  } = useLocale();

  const isRtl =
    direction === "rtl";

  const date =
    formatMobileSidebarDate(
      locale,
    );

  const greeting =
    t.layout.sidebar[
      getGreetingKey()
    ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label={
          t.layout.sidebar
            .closeSidebar
        }
        onClick={
          closeMobileSidebar
        }
        className="
          absolute
          inset-0
          bg-foreground/35
          backdrop-blur-[2px]
        "
      />

      <aside
        aria-label={
          t.layout.sidebar
            .navigation
        }
        className={[
          "sidebar-gradient sidebar-shell",
          "absolute top-0 z-10",
          "flex h-full w-[268px] max-w-[88vw]",
          "flex-col overflow-hidden",
          "text-sidebar-foreground",
          isRtl
            ? "right-0 rounded-l-[28px]"
            : "left-0 rounded-r-[28px]",
        ].join(" ")}
      >
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
                pointer-events-none
                absolute
                inset-x-3.5
                inset-y-[11px]
                rounded-[18px]
                bg-sidebar-foreground/[0.075]
              "
            />

            <div
              className="
                relative
                flex
                min-w-0
                flex-col
                items-center
                text-center
              "
            >
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
                {
                  t.layout.sidebar
                    .schoolName
                }
              </h1>

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
                  {date.weekday}
                  {" · "}
                  {date.month}
                  {" "}
                  {date.day}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={
                closeMobileSidebar
              }
              aria-label={
                t.layout.sidebar
                  .closeSidebar
              }
              title={
                t.layout.sidebar
                  .closeSidebar
              }
              className="
                absolute
                end-4
                top-1/2
                flex
                h-[38px]
                w-[38px]
                -translate-y-1/2
                items-center
                justify-center
                text-sidebar-muted
                transition-colors
                duration-200
                hover:text-sidebar-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-sidebar-foreground/25
              "
            >
              <PanelLeftClose
                aria-hidden="true"
                size={17}
                strokeWidth={1.9}
                className={
                  isRtl
                    ? "rotate-180"
                    : ""
                }
              />
            </button>
          </header>

          <div
            className="
              flex
              min-h-0
              flex-1
              flex-col
              overflow-hidden
              px-3.5
            "
          >
            <SidebarSectionSeparator
              variant="labels"
              label={
                t.layout.sidebar
                  .mainMenu
              }
              className="-mt-[7px] mb-[5px]"
            />

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              <SidebarMenu
                variant="labels"
                onNavigate={
                  closeMobileSidebar
                }
              />
            </div>

            <div
              className="
                shrink-0
                pb-[max(18px,env(safe-area-inset-bottom))]
                pt-2
              "
            >
              <SidebarSectionSeparator
                variant="labels"
                label={
                  t.layout.sidebar
                    .viewWebsite
                }
                className="mb-1 mt-1"
              />

              <a
                href={WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={
                  t.layout.sidebar
                    .viewWebsite
                }
                title={
                  t.layout.sidebar
                    .viewWebsite
                }
                className="
                  group
                  flex
                  h-[48px]
                  w-full
                  items-center
                  rounded-[17px]
                  px-3
                  text-sidebar-muted
                  transition-colors
                  duration-200
                  hover:bg-sidebar-foreground/[0.045]
                  hover:text-sidebar-foreground
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-sidebar-foreground/25
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    text-current
                  "
                >
                  <Globe2
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.8}
                  />
                </span>

                <span
                  className="
                    ms-3
                    min-w-0
                    flex-1
                    truncate
                    text-start
                    text-[13px]
                    font-medium
                    tracking-[-0.004em]
                  "
                >
                  {
                    t.layout.sidebar
                      .viewWebsite
                  }
                </span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
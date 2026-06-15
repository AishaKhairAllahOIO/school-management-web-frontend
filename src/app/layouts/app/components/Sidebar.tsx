import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

import sidebar from "@/assets/images/sidebar.png";
import { SidebarMenu } from "@/app/layouts/app/components/SidebarMenu";
import { useLayoutStore } from "@/app/layouts/app/store/layoutStore";
import { useLocale } from "@/app/providers/locale";
import { schoolConfigMock } from "@/features/settings/school-config/mocks/school-config.mock";

function getDisplaySchoolName(name: string, maxLength = 14) {
  if (name.length <= maxLength) return name;

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function getSchoolWebsiteUrl() {
  return schoolConfigMock.website ?? "#";
}

export function Sidebar() {
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  const { direction, t } = useLocale();

  const isRtl = direction === "rtl";

  const sidebarPositionClass = isRtl
    ? "right-0 rounded-l-3xl"
    : "left-0 rounded-r-3xl";

  const sidebarRadiusClass = isRtl ? "rounded-l-3xl" : "rounded-r-3xl";

  const collapsedTogglePositionClass = isRtl ? "right-[62px]" : "left-[62px]";

  const collapseIcon = isRtl ? (
    <ChevronRight size={15} />
  ) : (
    <ChevronLeft size={15} />
  );

  const expandIcon = isRtl ? (
    <ChevronLeft size={15} />
  ) : (
    <ChevronRight size={15} />
  );

  const schoolDisplayName = getDisplaySchoolName(schoolConfigMock.schoolName);
  const schoolWebsiteUrl = getSchoolWebsiteUrl();

  return (
    <aside
      className={[
        "fixed top-0 z-50 hidden h-screen overflow-visible sidebar-gradient text-sidebar-foreground shadow-2xl transition-all duration-300 ease-out lg:grid",
        sidebarPositionClass,
        isCollapsed
          ? "w-[56px] grid-cols-[56px] grid-rows-[76px_1fr_64px]"
          : "w-[242px] grid-cols-[56px_1fr] grid-rows-[76px_1fr_auto]",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute inset-0 z-0",
          sidebarRadiusClass,
        ].join(" ")}
        style={{
          backgroundImage: `url(${sidebar})`,
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          backgroundSize: "350px",
          opacity: 0.12,
          mixBlendMode: "difference",
          filter: "brightness(1.15)",
        }}
      />

      {isCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={t.layout.sidebar.expandSidebar}
          className={[
            "absolute top-6 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-card text-primary shadow-soft transition duration-300 hover:scale-105 hover:bg-accent",
            collapsedTogglePositionClass,
          ].join(" ")}
        >
          {expandIcon}
        </button>
      )}

      <div
        className={[
          "relative z-10 row-span-3 flex flex-col items-center bg-white/8",
          sidebarRadiusClass,
        ].join(" ")}
      >
        <div className="flex h-[76px] items-center justify-center">
          {isCollapsed ? (
            <GraduationCap size={26} strokeWidth={1.8} className="text-white" />
          ) : null}
        </div>

        <SidebarMenu variant="icons" />
      </div>

      {!isCollapsed && (
        <>
          <div className="relative z-10 flex h-[76px] items-center justify-between gap-3 border-b border-white/10 px-4 ps-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-white">
                <GraduationCap size={26} strokeWidth={1.8} />
              </span>

              <div className="min-w-0">
                <h1
                  title={schoolConfigMock.schoolName}
                  className="truncate text-[13px] font-semibold tracking-[-0.01em] text-white"
                >
                  {schoolDisplayName}
                </h1>

                <p className="truncate text-[10px] font-medium text-white/50">
                  {t.layout.sidebar.academy}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={t.layout.sidebar.collapseSidebar}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/75 transition duration-300 hover:bg-white/15 hover:text-white"
            >
              {collapseIcon}
            </button>
          </div>

          <div className="relative z-10 min-h-0 overflow-visible px-3 pt-3">
            <SidebarMenu variant="labels" />
          </div>

          <div className="relative z-10 border-t border-white/10 px-4 pb-4 pt-4">
            <a
              href={schoolWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 items-center justify-between rounded-2xl bg-white/5 px-3 text-[11px] font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <span>{t.layout.sidebar.schoolWebsite}</span>
              <ExternalLink size={13} strokeWidth={1.8} />
            </a>
          </div>
        </>
      )}
    </aside>
  );
}
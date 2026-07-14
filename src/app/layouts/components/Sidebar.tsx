import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

import sidebarPattern from "@/assets/images/sidebar.png";
import { SidebarMenu } from "@/app/layouts/components/SidebarMenu";
import { useLayoutStore } from "@/app/layouts/store/layoutStore";
import { useLocale } from "@/app/providers/locale";
import { useGeneralSettings } from "@/features/settings/general/hooks/useGeneralSettings";

function getDisplaySchoolName(
  schoolName: string,
  shortName: string,
  maxLength = 14,
) {
  const normalizedShortName = shortName.trim();

  if (normalizedShortName) {
    return normalizedShortName;
  }

  const normalizedSchoolName = schoolName.trim();

  if (!normalizedSchoolName) {
    return "";
  }

  if (normalizedSchoolName.length <= maxLength) {
    return normalizedSchoolName;
  }

  return normalizedSchoolName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function normalizeExternalUrl(
  url: string,
): string | null {
  const normalizedUrl = url.trim();

  if (!normalizedUrl) {
    return null;
  }

  if (
    normalizedUrl.startsWith("http://") ||
    normalizedUrl.startsWith("https://")
  ) {
    return normalizedUrl;
  }

  return `https://${normalizedUrl}`;
}

type SchoolLogoProps = {
  logoUrl: string | null;
  schoolName: string;
};

function SchoolLogo({
  logoUrl,
  schoolName,
}: SchoolLogoProps) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${schoolName} logo`}
        draggable={false}
        className="h-9 w-9 object-contain"
      />
    );
  }

  return (
    <GraduationCap
      aria-hidden="true"
      size={27}
      strokeWidth={1.8}
      className="text-sidebar-foreground"
    />
  );
}

export function Sidebar() {
  const isCollapsed = useLayoutStore(
    (state) => state.isSidebarCollapsed,
  );

  const toggleSidebar = useLayoutStore(
    (state) => state.toggleSidebar,
  );

  const { direction, t } = useLocale();

  const {
    data: generalSettings,
    isLoading: isGeneralSettingsLoading,
  } = useGeneralSettings();

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

  const collapseIcon = isRtl ? (
    <ChevronRight
      aria-hidden="true"
      size={15}
    />
  ) : (
    <ChevronLeft
      aria-hidden="true"
      size={15}
    />
  );

  const expandIcon = isRtl ? (
    <ChevronLeft
      aria-hidden="true"
      size={15}
    />
  ) : (
    <ChevronRight
      aria-hidden="true"
      size={15}
    />
  );

  const schoolName =
    generalSettings?.schoolName.trim() ?? "";

  const schoolShortName =
    generalSettings?.shortName.trim() ?? "";

  const schoolDisplayName = getDisplaySchoolName(
    schoolName,
    schoolShortName,
  );

  const schoolWebsiteUrl = normalizeExternalUrl(
    generalSettings?.website ?? "",
  );

  const schoolLogoUrl =
    generalSettings?.logoUrl ?? null;

  return (
    <aside
      className={[
        "sidebar-gradient sidebar-shell fixed top-0 z-50 hidden h-screen overflow-visible text-sidebar-foreground transition-all duration-300 ease-out motion-reduce:transition-none lg:grid",
        sidebarPositionClass,
        isCollapsed
          ? "w-[56px] grid-cols-[56px] grid-rows-[76px_1fr_64px]"
          : "w-[242px] grid-cols-[56px_1fr] grid-rows-[76px_1fr_auto]",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 z-0 overflow-hidden",
          sidebarRadiusClass,
        ].join(" ")}
      >
        <div
          className="sidebar-pattern absolute inset-0"
          style={{
            backgroundImage: `url(${sidebarPattern})`,
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            backgroundSize: "350px",
          }}
        />
      </div>

      {isCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={
            t.layout.sidebar.expandSidebar
          }
          className={[
            "absolute top-6 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-card text-primary shadow-soft",
            "transition duration-300 hover:scale-105 hover:bg-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "motion-reduce:transform-none motion-reduce:transition-none",
            collapsedTogglePositionClass,
          ].join(" ")}
        >
          {expandIcon}
        </button>
      )}

      <div
        className={[
          "relative z-10 row-span-3 flex flex-col items-center bg-sidebar-foreground/5",
          sidebarRadiusClass,
        ].join(" ")}
      >
        <div className="flex h-[76px] items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center">
            {isGeneralSettingsLoading ? (
              <span
                aria-hidden="true"
                className="h-8 w-8 animate-pulse rounded-lg bg-sidebar-foreground/10"
              />
            ) : (
              <SchoolLogo
                logoUrl={schoolLogoUrl}
                schoolName={schoolName || schoolDisplayName}
              />
            )}
          </div>
        </div>

        <SidebarMenu variant="icons" />
      </div>

      {!isCollapsed && (
        <>
          <header className="relative z-10 flex h-[76px] items-center border-b border-sidebar-foreground/10 px-4">
  <div className="flex-1 text-center">
    {isGeneralSettingsLoading ? (
      <div className="mx-auto space-y-2">
        <span className="mx-auto block h-3 w-28 animate-pulse rounded bg-sidebar-foreground/10" />
      </div>
    ) : (
      <h1
        title={schoolName}
        className="truncate text-[14px] font-semibold tracking-[-0.01em] text-sidebar-foreground"
      >
        {schoolDisplayName}
      </h1>
    )}
  </div>

  <button
    type="button"
    onClick={toggleSidebar}
    aria-label={t.layout.sidebar.collapseSidebar}
    className={[
      "absolute",
      isRtl ? "left-4" : "right-4",
      "flex h-8 w-8 items-center justify-center rounded-full",
      "bg-sidebar-foreground/5 text-sidebar-muted",
      "transition duration-300",
      "hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-foreground/30",
    ].join(" ")}
  >
    {collapseIcon}
  </button>
</header>

          <div className="relative z-10 min-h-0 overflow-visible px-3 pt-3">
            <SidebarMenu variant="labels" />
          </div>

          {schoolWebsiteUrl && (
            <div className="relative z-10 border-t border-sidebar-foreground/10 px-4 pb-4 pt-4">
              <a
                href={schoolWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  "flex h-10 items-center justify-between rounded-2xl",
                  "bg-sidebar-foreground/5 px-3",
                  "text-[11px] font-semibold text-sidebar-muted",
                  "transition hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-foreground/30",
                  "motion-reduce:transition-none",
                ].join(" ")}
              >
                <span>
                  {t.layout.sidebar.schoolWebsite}
                </span>

                <ExternalLink
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.8}
                />
              </a>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
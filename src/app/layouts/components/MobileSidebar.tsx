import {
  ExternalLink,
  GraduationCap,
  X,
} from "lucide-react";

import sidebarPattern from "@/assets/images/sidebar.png";
import { SidebarMenu } from "@/app/layouts/components/SidebarMenu";
import { useLayoutStore } from "@/app/layouts/store/layoutStore";
import { useLocale } from "@/app/providers/locale";
import { useGeneralSettings } from "@/features/settings/general/hooks/useGeneralSettings";

function getDisplaySchoolName(
  schoolName: string,
  shortName: string,
  maxLength = 22,
): string {
  const normalizedShortName =
    shortName.trim();

  if (normalizedShortName) {
    return normalizedShortName;
  }

  const normalizedSchoolName =
    schoolName.trim();

  if (!normalizedSchoolName) {
    return "";
  }

  if (
    normalizedSchoolName.length <= maxLength
  ) {
    return normalizedSchoolName;
  }

  return normalizedSchoolName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      word.charAt(0).toUpperCase(),
    )
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

  const schoolName =
    generalSettings?.schoolName.trim() ??
    "";

  const shortName =
    generalSettings?.shortName.trim() ??
    "";

  const schoolDisplayName =
    getDisplaySchoolName(
      schoolName,
      shortName,
    );

  const schoolLogoUrl =
    generalSettings?.logoUrl ?? null;

  const schoolWebsiteUrl =
    normalizeExternalUrl(
      generalSettings?.website ?? "",
    );

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
        className="absolute inset-0 bg-foreground/45 backdrop-blur-[2px]"
      />

      <aside
        aria-label={
          t.layout.sidebar.navigation
        }
        className={[
          "sidebar-gradient sidebar-shell absolute top-0 z-10 flex h-full w-[282px] max-w-[86vw] flex-col overflow-hidden text-sidebar-foreground",
          sidebarPositionClass,
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

        <header className="relative z-10 flex h-[76px] shrink-0 items-center border-b border-sidebar-foreground/10 px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
              {isGeneralSettingsLoading ? (
                <span
                  aria-hidden="true"
                  className="h-8 w-8 animate-pulse rounded-lg bg-sidebar-foreground/10"
                />
              ) : (
                <SchoolLogo
                  logoUrl={schoolLogoUrl}
                  schoolName={
                    schoolName ||
                    schoolDisplayName
                  }
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              {isGeneralSettingsLoading ? (
                <span className="block h-3 w-28 animate-pulse rounded bg-sidebar-foreground/10" />
              ) : (
                <h1
                  title={schoolName}
                  className="truncate text-center text-[13px] font-semibold tracking-[-0.01em] text-sidebar-foreground"
                >
                  {schoolDisplayName}
                </h1>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label={
              t.layout.sidebar.closeSidebar
            }
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              "bg-sidebar-foreground/5 text-sidebar-muted",
              "transition duration-300 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-foreground/30",
              "motion-reduce:transition-none",
            ].join(" ")}
          >
            <X
              aria-hidden="true"
              size={16}
            />
          </button>
        </header>

        <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <SidebarMenu
            variant="labels"
            onNavigate={closeMobileSidebar}
          />
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
                {
                  t.layout.sidebar
                    .schoolWebsite
                }
              </span>

              <ExternalLink
                aria-hidden="true"
                size={13}
                strokeWidth={1.8}
              />
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
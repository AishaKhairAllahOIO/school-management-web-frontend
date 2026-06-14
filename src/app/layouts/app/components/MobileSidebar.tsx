import { ExternalLink, GraduationCap, X } from "lucide-react";

import sidebar from "@/assets/images/sidebar.png";
import { SidebarMenu } from "@/app/layouts/app/components/SidebarMenu";
import { useLayoutStore } from "@/app/layouts/app/store/layoutStore";
import { schoolConfigMock } from "@/features/settings/school-config/mocks/school-config.mock";

function getDisplaySchoolName(name: string, maxLength = 22) {
  if (name.length <= maxLength) return name;

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function MobileSidebar() {
  const isOpen = useLayoutStore((state) => state.isMobileSidebarOpen);
  const closeMobileSidebar = useLayoutStore(
    (state) => state.closeMobileSidebar
  );

  const schoolDisplayName = getDisplaySchoolName(schoolConfigMock.schoolName);

  const schoolWebsiteUrl =
    (schoolConfigMock as { websiteUrl?: string; schoolWebsiteUrl?: string })
      .websiteUrl ??
    (schoolConfigMock as { websiteUrl?: string; schoolWebsiteUrl?: string })
      .schoolWebsiteUrl ??
    "#";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label="Close mobile sidebar overlay"
        onClick={closeMobileSidebar}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <aside className="sidebar-gradient relative z-10 flex h-full w-[282px] max-w-[86vw] flex-col overflow-hidden rounded-r-3xl text-sidebar-foreground shadow-2xl">
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-r-3xl"
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

        <div className="relative z-10 flex h-[76px] items-center justify-between gap-3 border-b border-white/10 px-5">
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
                Academy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/75 transition duration-300 hover:bg-white/15 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <SidebarMenu variant="labels" onNavigate={closeMobileSidebar} />
        </div>

        <div className="relative z-10 border-t border-white/10 px-4 pb-4 pt-4">
          <a
            href={schoolWebsiteUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center justify-between rounded-2xl bg-white/5 px-3 text-[11px] font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span>School Website</span>
            <ExternalLink size={13} strokeWidth={1.8} />
          </a>
        </div>
      </aside>
    </div>
  );
}
import { Outlet } from "react-router-dom";

import { MobileSidebar } from "@/app/layouts/dashboard/components/MobileSidebar";
import { ProfilePanel } from "@/app/layouts/dashboard/components/ProfilePanel";
import { Sidebar } from "@/app/layouts/dashboard/components/Sidebar";
import { SubNavigation } from "@/app/layouts/dashboard/components/SubNavigation";
import { Topbar } from "@/app/layouts/dashboard/components/Topbar";
import { useLayoutStore } from "@/app/layouts/dashboard/store/layoutStore";

export function DashboardLayout() {
  const isSidebarCollapsed = useLayoutStore(
    (state) => state.isSidebarCollapsed
  );

  const isProfilePanelOpen = useLayoutStore(
    (state) => state.isProfilePanelOpen
  );

  return (
    <div className="h-screen overflow-hidden app-shell-bg">
      <Sidebar />
      <MobileSidebar />
      <ProfilePanel />

      <div
        className={[
          "flex h-screen flex-col transition-all duration-300 ease-out",
          isSidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[238px]",
          isProfilePanelOpen ? "lg:pr-[344px]" : "lg:pr-0",
        ].join(" ")}
      >
        <div className="shrink-0 px-4 md:px-6 lg:px-8">
          <Topbar />
          <SubNavigation />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-3 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import { Outlet } from "react-router-dom";

import { MobileSidebar } from "@/app/layouts/dashboard/components/MobileSidebar";
import { ProfilePanel } from "@/app/layouts/dashboard/components/ProfilePanel";
import { Sidebar } from "@/app/layouts/dashboard/components/Sidebar";
import { Topbar } from "@/app/layouts/dashboard/components/Topbar";
import { useLayoutStore } from "@/app/layouts/dashboard/store/layoutStore";

export function DashboardLayout() {
  const isSidebarCollapsed = useLayoutStore(
    (state) => state.isSidebarCollapsed
  );

  return (
    <div className="min-h-screen app-shell-bg">
      <Sidebar />

      <MobileSidebar />

      <ProfilePanel />

      <div
        className={[
          "min-h-screen transition-all duration-300",
          isSidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[238px]",
        ].join(" ")}
      >
        <Topbar />

        <main className="px-4 pb-5 pt-4 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
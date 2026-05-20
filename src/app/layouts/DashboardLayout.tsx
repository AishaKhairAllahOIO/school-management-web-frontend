import { Outlet } from "react-router-dom";

import { MobileSidebar } from "@/features/dashboard/components/MobileSidebar";
import { ProfilePanel } from "@/features/dashboard/components/ProfilePanel";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { SubNavigation } from "@/features/dashboard/components/SubNavigation";
import { Topbar } from "@/features/dashboard/components/Topbar";
import { useLayoutStore } from "@/features/dashboard/store/layoutStore";

export function DashboardLayout() {
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />
      <ProfilePanel />

      <div
        className={[
          "min-h-screen transition-all duration-300 ease-out",
          isCollapsed ? "lg:pl-[56px]" : "lg:pl-[218px]",
        ].join(" ")}
      >
        <Topbar />
        <SubNavigation />

        <main className="px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
          <div className="page-shell fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
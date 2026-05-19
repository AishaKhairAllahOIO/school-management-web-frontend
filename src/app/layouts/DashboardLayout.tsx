import { Outlet } from "react-router-dom";

import { MobileSidebar } from "@/features/dashboard/components/MobileSidebar";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Topbar } from "@/features/dashboard/components/Topbar";
import { useLayoutStore } from "@/features/dashboard/store/layoutStore";

export function DashboardLayout() {
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />

      <div
        className={[
          "min-h-screen transition-all duration-300",
          isCollapsed ? "lg:pl-[56px]" : "lg:pl-[218px]",
        ].join(" ")}
      >
        <Topbar />

        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
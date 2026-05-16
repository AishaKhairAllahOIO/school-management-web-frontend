import { Outlet } from "react-router-dom";

import { MobileSidebar } from "@/features/dashboard/components/MobileSidebar";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Topbar } from "@/features/dashboard/components/Topbar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />

      <div className="min-h-screen lg:pl-80">
        <Topbar />

        <main className="p-4 md:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
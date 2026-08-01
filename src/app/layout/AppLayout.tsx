import { Outlet } from "react-router-dom";

import { MobileSidebar } from "@/app/layout/components/sidebar/MobileSidebar";
import { Sidebar } from "@/app/layout/components/sidebar/Sidebar";
import { SubNavigation } from "@/app/layout/components/navigation/SubNavigation";
import { Topbar } from "@/app/layout/components/topbar/Topbar";
import { useLayoutStore } from "@/app/layout/store/layoutStore";
import { useLocale } from "@/app/providers/locale";

export function AppLayout() {
  const isSidebarCollapsed =
    useLayoutStore(
      (state) => state.isSidebarCollapsed,
    );

  const { direction } = useLocale();

  const isRtl = direction === "rtl";

  const sidebarOffsetClass =
    isRtl
      ? isSidebarCollapsed
        ? "lg:pr-[70px]"
        : "lg:pr-[248px]"
      : isSidebarCollapsed
        ? "lg:pl-[70px]"
        : "lg:pl-[248px]";

  return (
    <div className="app-shell-bg min-h-screen">
      <Sidebar />

      <MobileSidebar />

      <div
        className={[
          "flex min-h-screen flex-col",
          "transition-[padding] duration-300 ease-out",
          "motion-reduce:transition-none",
          sidebarOffsetClass,
        ].join(" ")}
      >
        <div
          className="
            shrink-0
            px-4
            md:px-6
            lg:px-8
          "
        >
          <Topbar />
        </div>

        <div
          className="
            mt-5
            shrink-0
            px-4
            md:px-6
            lg:px-8
          "
        >
          <SubNavigation />
        </div>

        <main
          className="
            flex-1
            px-4
            pb-6
            pt-3
            md:px-6
            lg:px-8
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import { Outlet } from "react-router-dom";

import { MobileSidebar } from "@/app/layouts/components/MobileSidebar";
import { Sidebar } from "@/app/layouts/components/Sidebar";
import { SubNavigation } from "@/app/layouts/components/SubNavigation";
import { Topbar } from "@/app/layouts/components/Topbar";
import { useLayoutStore } from "@/app/layouts/store/layoutStore";
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
        ? "lg:pr-[72px]"
        : "lg:pr-[258px]"
      : isSidebarCollapsed
        ? "lg:pl-[72px]"
        : "lg:pl-[258px]";



  return (

    <div className="app-shell-bg h-screen overflow-hidden">


      <Sidebar />


      <MobileSidebar />



      <div
        className={[
          "flex h-screen flex-col",
          "transition-all duration-300 ease-out",
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

          <SubNavigation />

        </div>





        <main
          className="
          min-h-0
          flex-1
          overflow-y-auto
          px-4
          pb-6
          pt-0
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
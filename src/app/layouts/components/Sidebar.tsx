import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

import { SidebarMenu } from "@/app/layouts/components/SidebarMenu";
import { useLayoutStore } from "@/app/layouts/store/layoutStore";
import { useLocale } from "@/app/providers/locale";


export function Sidebar() {

  const isCollapsed = useLayoutStore(
    (state) => state.isSidebarCollapsed,
  );


  const toggleSidebar = useLayoutStore(
    (state) => state.toggleSidebar,
  );


  const { direction, t } = useLocale();


  const isRtl = direction === "rtl";


  const sidebarPositionClass = isRtl
    ? "right-0 rounded-l-3xl"
    : "left-0 rounded-r-3xl";


  const sidebarRadiusClass = isRtl
    ? "rounded-l-3xl"
    : "rounded-r-3xl";

  const collapseIcon = isRtl ? (
<ChevronRight
  size={15}
  strokeWidth={2}
/>  ) : (
    <ChevronLeft
  size={15}
  strokeWidth={2}
/>
  );


  const expandIcon = isRtl ? (
   <ChevronLeft
  size={15}
  strokeWidth={2}
/>
  ) : (
   <ChevronRight
  size={15}
  strokeWidth={2}
/> 
  );



  return (

    <aside
      className={[
        "sidebar-gradient sidebar-shell",
        "fixed top-0 z-50 hidden h-screen overflow-visible",
        "text-sidebar-foreground",
        "transition-[width] duration-300 ease-out",
        "lg:flex lg:flex-col",
        sidebarPositionClass,

        isCollapsed
          ? "w-[72px]"
          : "w-[248px]",

      ].join(" ")}
    >



      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          "z-0 overflow-hidden",
          sidebarRadiusClass,
        ].join(" ")}
      />




      <div
        className="
        relative
        z-10
        flex
        h-full
        min-h-0
        flex-col
        "
      >



        <header
          className={[
            "relative flex shrink-0 items-center",

            isCollapsed
              ? "h-[82px] justify-center px-3"
             : "h-[82px] px-4 pe-8",

          ].join(" ")}
        >



          {isCollapsed ? (


            <div
              className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-2xl
              border
              border-sidebar-foreground/10
              bg-sidebar-foreground/10
              "
            >

              <GraduationCap
                size={22}
                strokeWidth={1.8}
              />

            </div>


          ) : (



            <div
              className="
              flex
              min-w-0
              items-center
              gap-2.5
              "
            >


              <div
                className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-sidebar-foreground/10
                bg-sidebar-foreground/10
                "
              >

                <GraduationCap
                  size={22}
                  strokeWidth={1.8}
                />

              </div>



              <div className="min-w-0">

                <h1
                  className="
                  truncate
                  text-[14px]
                  font-semibold
                  leading-5
                  "
                >
                  School Management
                </h1>


                <p
                  className="
                  mt-0.5
                  truncate
                  text-[10px]
                  font-medium
                  text-sidebar-muted
                  "
                >
                  Administration Platform
                </p>


              </div>


            </div>


          )}




<button
  type="button"
  onClick={toggleSidebar}
  aria-label={
    isCollapsed
      ? t.layout.sidebar.expandSidebar
      : t.layout.sidebar.collapseSidebar
  }
  className="
  absolute
  end-2
  top-1/2
  -translate-y-1/2
  flex
  h-6
  w-6
  items-center
  justify-center
  text-sidebar-foreground/60
  transition
  hover:text-sidebar-foreground
  focus-visible:outline-none
  "
>

  {
    isCollapsed
      ? expandIcon
      : collapseIcon
  }

</button>


        </header>





        <div
          className={[
            "min-h-0 flex-1 overflow-y-auto",

            isCollapsed
              ? "px-2 pt-1"
              : "px-3 pt-0",

          ].join(" ")}
        >



          {!isCollapsed ? (


            <div
              className="
              mb-2
              flex
              items-center
              gap-3
              px-2
              "
            >

              <span
                className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-sidebar-muted/80
                "
              >
                Main menu
              </span>


              <span
                className="
                h-px
                flex-1
                bg-sidebar-foreground/[0.08]
                "
              />


            </div>



          ) : (


            <div
              className="
              mb-2
              h-px
              bg-sidebar-foreground/[0.06]
              "
            />


          )}




          <SidebarMenu
            variant={
              isCollapsed
              ? "icons"
              : "labels"
            }
          />


        </div>


      </div>


    </aside>

  );
}
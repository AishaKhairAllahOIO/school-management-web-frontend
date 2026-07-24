import { Menu } from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useLocation } from "react-router-dom";


import { useCurrentUser } from "@/app/layouts/hooks/useCurrentUser";
import { useLayoutStore } from "@/app/layouts/store/layoutStore";
import { useLocale } from "@/app/providers/locale";

import { LanguageToggle } from "@/shared/components/locale";


import { NotificationsMenu } from "./topbar/NotificationsMenu";
import { ProfileMenu } from "./topbar/ProfileMenu";
import { ThemeButton } from "./topbar/ThemeButton";
import { TopbarBreadcrumb } from "./topbar/TopbarBreadcrumb";

import {
  TOPBAR_ICON_BUTTON_CLASS_NAME,
} from "./topbar/topbar.constants";




export function Topbar() {


  const location =
    useLocation();


  const { t } =
    useLocale();



  const openMobileSidebar =
    useLayoutStore(
      (state) =>
        state.openMobileSidebar,
    );



  const {
    user,
  } = useCurrentUser();




  const fullName =
    user?.fullName ??
    (
      user
        ? `${user.firstName} ${user.lastName}`
        : "Loading..."
    );



  const photoUrl =
    user?.photoUrl ??
    "/images/avatar-placeholder.png";





  const [
    isNotificationsOpen,
    setIsNotificationsOpen,
  ] = useState(false);



  const [
    isProfileMenuOpen,
    setIsProfileMenuOpen,
  ] = useState(false);






  useEffect(() => {

    setIsNotificationsOpen(false);

    setIsProfileMenuOpen(false);

  },[
    location.pathname
  ]);







  function toggleNotifications(){

    setIsNotificationsOpen(
      current =>
        !current,
    );

    setIsProfileMenuOpen(false);

  }





  function toggleProfileMenu(){

    setIsProfileMenuOpen(
      current =>
        !current,
    );

    setIsNotificationsOpen(false);

  }






  return (

    <header
      className="
      sticky
      top-0
      z-40
      pb-2
      pt-3
      "
    >



      <div
        className="
        flex
        h-[50px]
        w-full
        items-center
        justify-between
        "
      >





        <div
          className="
          flex
          min-w-0
          flex-1
          items-center
          "
        >




          <button
            type="button"
            onClick={
              openMobileSidebar
            }
            aria-label={
              t.layout.topbar.openSidebar
            }
            className={`
            ${TOPBAR_ICON_BUTTON_CLASS_NAME}
            mr-3
            lg:hidden
            `}
          >

            <Menu
              aria-hidden="true"
              size={19}
              strokeWidth={2.1}
            />

          </button>





          <TopbarBreadcrumb
            pathname={
              location.pathname
            }
          />



        </div>






        <div
          className="
          flex
          shrink-0
          items-center
          gap-2
          "
        >



          <NotificationsMenu
            isOpen={
              isNotificationsOpen
            }
            onToggle={
              toggleNotifications
            }
            onClose={() =>
              setIsNotificationsOpen(false)
            }
          />




          <LanguageToggle
            className={
              TOPBAR_ICON_BUTTON_CLASS_NAME
            }
          />




          <ThemeButton />





          <ProfileMenu
            isOpen={
              isProfileMenuOpen
            }
            onToggle={
              toggleProfileMenu
            }
            onClose={() =>
              setIsProfileMenuOpen(false)
            }
          />





          <button
            type="button"
            onClick={
              toggleProfileMenu
            }
            aria-label={
              t.layout.topbar.openProfileMenu
            }
            className="
            flex
            h-[42px]
            w-[42px]
            items-center
            justify-center
            rounded-full
            lg:hidden
            "
          >

            <img
              src={photoUrl}
              alt={fullName}
              className="
              h-10
              w-10
              rounded-full
              object-cover
              ring-2
              ring-topbar-surface
              "
            />

          </button>




        </div>




      </div>


    </header>

  );
}
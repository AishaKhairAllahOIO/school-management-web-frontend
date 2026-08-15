import { PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { useLayoutStore } from "@/app/layout/store/layoutStore";
import { useLocale } from "@/app/providers/locale";

import { LanguageToggle } from "@/shared/components/locale";

import { NotificationsMenu } from "./notifications/NotificationsMenu";
import { ProfileMenu } from "./profile/ProfileMenu";
import { ThemeButton } from "./ThemeButton";
import { TopbarBreadcrumb } from "./TopbarBreadcrumb";

import {
  TOPBAR_ICON_BUTTON_CLASS_NAME,
} from "./topbar.constants";

type OpenTopbarMenu =
  | "notifications"
  | "profile"
  | null;

type TopbarMenuState = {
  pathname: string;
  openMenu: OpenTopbarMenu;
};

export function Topbar() {
  const location = useLocation();
  const { t } = useLocale();

  const openMobileSidebar =
    useLayoutStore(
      (state) =>
        state.openMobileSidebar,
    );

  const [menuState, setMenuState] =
    useState<TopbarMenuState>({
      pathname:
        location.pathname,
      openMenu: null,
    });

  const isCurrentPath =
    menuState.pathname ===
    location.pathname;

  const isNotificationsOpen =
    isCurrentPath &&
    menuState.openMenu ===
      "notifications";

  const isProfileMenuOpen =
    isCurrentPath &&
    menuState.openMenu ===
      "profile";

  function toggleNotifications() {
    setMenuState((current) => {
      const isAlreadyOpen =
        current.pathname ===
          location.pathname &&
        current.openMenu ===
          "notifications";

      return {
        pathname:
          location.pathname,
        openMenu:
          isAlreadyOpen
            ? null
            : "notifications",
      };
    });
  }

  function toggleProfileMenu() {
    setMenuState((current) => {
      const isAlreadyOpen =
        current.pathname ===
          location.pathname &&
        current.openMenu ===
          "profile";

      return {
        pathname:
          location.pathname,
        openMenu:
          isAlreadyOpen
            ? null
            : "profile",
      };
    });
  }

  function closeNotifications() {
    setMenuState({
      pathname:
        location.pathname,
      openMenu: null,
    });
  }

  function closeProfileMenu() {
    setMenuState({
      pathname:
        location.pathname,
      openMenu: null,
    });
  }

  return (
    <header className="sticky top-0 z-40 pb-2 pt-2.5 sm:pb-3 sm:pt-4 lg:pt-6">
      <div className="flex min-h-11 w-full items-center justify-between gap-1.5 sm:h-14 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          {/* ------------------------------------------------------------ */}
          {/* Mobile Sidebar Trigger                                       */}
          {/* ------------------------------------------------------------ */}

          <button
            id="topbar-mobile-sidebar"
            type="button"
            onClick={
              openMobileSidebar
            }
            aria-label={
              t.layout.topbar
                .openSidebar
            }
            className="
              me-0.5
              flex
              h-[42px]
              w-[42px]
              shrink-0
              items-center
              justify-center
              border-0
              bg-transparent
              p-0
              text-topbar-foreground
              shadow-none
              transition-colors
              duration-200
              hover:text-primary
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/15
              sm:me-2
              sm:h-12
              sm:w-12
              lg:hidden
            "
          >
            <PanelLeftOpen
              aria-hidden="true"
              size={19}
              strokeWidth={1.9}
            />
          </button>

          <TopbarBreadcrumb
            pathname={
              location.pathname
            }
          />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:gap-2.5">
          {/* ---------------------------------------------------------- */}
          {/* Notifications                                              */}
          {/* ---------------------------------------------------------- */}

          <NotificationsMenu
            isOpen={
              isNotificationsOpen
            }
            onToggle={
              toggleNotifications
            }
            onClose={
              closeNotifications
            }
          />

          {/* ---------------------------------------------------------- */}
          {/* Language                                                   */}
          {/* ---------------------------------------------------------- */}

          <div className="block shrink-0">
            <LanguageToggle
              className={
                TOPBAR_ICON_BUTTON_CLASS_NAME
              }
            />
          </div>

          {/* ---------------------------------------------------------- */}
          {/* Theme                                                      */}
          {/* ---------------------------------------------------------- */}

          <div className="block shrink-0">
            <ThemeButton />
          </div>

          {/* ---------------------------------------------------------- */}
          {/* Profile                                                    */}
          {/* ---------------------------------------------------------- */}

          <div id="topbar-profile">
            <ProfileMenu
              isOpen={
                isProfileMenuOpen
              }
              onToggle={
                toggleProfileMenu
              }
              onClose={
                closeProfileMenu
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}
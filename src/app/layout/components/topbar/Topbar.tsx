import { Menu } from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

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

export function Topbar() {
  const location = useLocation();

  const { t } = useLocale();

  const openMobileSidebar =
    useLayoutStore(
      (state) =>
        state.openMobileSidebar,
    );

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
  }, [location.pathname]);

  function toggleNotifications() {
    setIsNotificationsOpen(
      (current) => !current,
    );

    setIsProfileMenuOpen(false);
  }

  function toggleProfileMenu() {
    setIsProfileMenuOpen(
      (current) => !current,
    );

    setIsNotificationsOpen(false);
  }

  return (
    <header
      className="
        sticky
        top-0
        z-40
        pb-3
        pt-5
        lg:pt-6
      "
    >
      <div
        className="
          flex
          h-[56px]
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
            onClick={openMobileSidebar}
            aria-label={
              t.layout.topbar.openSidebar
            }
            className={`
              ${TOPBAR_ICON_BUTTON_CLASS_NAME}
              me-3
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
            pathname={location.pathname}
          />
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2 lg:gap-2.5
          "
        >
          <NotificationsMenu
            isOpen={isNotificationsOpen}
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
            isOpen={isProfileMenuOpen}
            onToggle={toggleProfileMenu}
            onClose={() =>
              setIsProfileMenuOpen(false)
            }
          />
        </div>
      </div>
    </header>
  );
}
import { PanelLeftOpen } from "lucide-react";

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

  const openMobileSidebar = useLayoutStore(
    (state) => state.openMobileSidebar,
  );

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] =
    useState(false);

  useEffect(() => {
    setIsNotificationsOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  function toggleNotifications() {
    setIsNotificationsOpen((current) => !current);
    setIsProfileMenuOpen(false);
  }

  function toggleProfileMenu() {
    setIsProfileMenuOpen((current) => !current);
    setIsNotificationsOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 pb-2 pt-2.5 sm:pb-3 sm:pt-4 lg:pt-6">
      <div className="flex min-h-[46px] w-full items-center justify-between gap-1.5 sm:h-[56px] sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          <button
            type="button"
            onClick={openMobileSidebar}
            aria-label={t.layout.topbar.openSidebar}
            className="me-0.5 flex h-[42px] w-[42px] shrink-0 items-center justify-center border-0 bg-transparent p-0 text-topbar-foreground shadow-none transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 sm:me-2 sm:h-[48px] sm:w-[48px] lg:hidden"
          >
            <PanelLeftOpen aria-hidden="true" size={19} strokeWidth={1.9} />
          </button>

          <TopbarBreadcrumb pathname={location.pathname} />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:gap-2.5">
          <NotificationsMenu
            isOpen={isNotificationsOpen}
            onToggle={toggleNotifications}
            onClose={() => setIsNotificationsOpen(false)}
          />

          <div className="block shrink-0">
            <LanguageToggle
              className={TOPBAR_ICON_BUTTON_CLASS_NAME}
            />
          </div>

          <div className="block shrink-0">
            <ThemeButton />
          </div>

          <ProfileMenu
            isOpen={isProfileMenuOpen}
            onToggle={toggleProfileMenu}
            onClose={() => setIsProfileMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}

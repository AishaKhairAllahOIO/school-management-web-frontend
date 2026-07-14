import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useCurrentUser } from "@/app/layouts/hooks/useCurrentUser";
import { useNotifications } from "@/app/layouts/hooks/useNotifications";
import { useLayoutStore } from "@/app/layouts/store/layoutStore";
import { useLocale } from "@/app/providers/locale";
import { useAppTheme } from "@/app/providers/theme";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { LanguageToggle } from "@/shared/components/locale";

const topbarItem = [
  "topbar-item-shadow",
  "relative flex h-[44px] w-[44px] items-center justify-center",
  "rounded-[14px] border border-topbar-border",
  "bg-topbar-surface/92 text-topbar-foreground",
  "backdrop-blur-xl transition duration-200",
  "hover:-translate-y-0.5 hover:bg-topbar-surface",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "motion-reduce:transform-none motion-reduce:transition-none",
].join(" ");

function MoonFillIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20.45 15.28A8.35 8.35 0 0 1 8.72 3.55a8.75 8.75 0 1 0 11.73 11.73Z"
        fill="currentColor"
      />
    </svg>
  );
}

function formatSegment(value?: string) {
  if (!value) return "";

  return value
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function getSectionKey(pathname: string) {
  if (pathname === "/") return "dashboard";
  if (pathname.startsWith("/users")) return "users";
  if (pathname.startsWith("/academics")) return "academics";
  if (pathname.startsWith("/attendance")) return "attendance";
  if (pathname.startsWith("/scheduling")) return "scheduling";
  if (pathname.startsWith("/finance")) return "finance";

  if (pathname.startsWith("/communications")) {
    return "communications";
  }

  if (pathname.startsWith("/reports")) return "reports";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/profile")) return "profile";

  return "dashboard";
}

function getCurrentPageTitle(
  pathname: string,
  overviewLabel: string,
) {
  const segments = pathname
    .split("/")
    .filter(Boolean);

  if (segments.length <= 1) {
    return overviewLabel;
  }

  return formatSegment(segments[1]);
}

function getRoleLabel(user: {
  category?: string;
  role?: string;
}) {
  if (user.role) return user.role;

  if (user.category === "super_admin") {
    return "Super Admin";
  }

  if (user.category === "secretary") {
    return "Secretary";
  }

  if (user.category === "supervisor") {
    return "Supervisor";
  }

  return "User";
}

function TopbarBreadcrumb({
  pathname,
}: {
  pathname: string;
}) {
  const { direction, t } = useLocale();

  const sectionKey = getSectionKey(pathname);
  const sectionTitle =
    t.navigation[sectionKey];

  const currentPageTitle =
    getCurrentPageTitle(
      pathname,
      t.layout.topbar.overview,
    );

  const BreadcrumbChevron =
    direction === "rtl"
      ? ChevronLeft
      : ChevronRight;

  return (
    <div className="hidden min-w-0 items-center gap-[13px] lg:flex">
      <h1 className="truncate text-[15px] font-bold tracking-[-0.02em] text-topbar-title">
        {sectionTitle}
      </h1>

      <BreadcrumbChevron
        aria-hidden="true"
        size={14}
        strokeWidth={1.9}
        className="shrink-0 text-topbar-subtle/55"
      />

      <span className="inline-flex h-[34px] max-w-[150px] shrink-0 items-center rounded-[12px] border border-topbar-border bg-topbar-soft px-[17px] text-[12px] font-semibold text-topbar-text">
        {currentPageTitle}
      </span>
    </div>
  );
}

function ThemeButton() {
  const { resolvedTheme, setTheme } =
    useAppTheme();

  const { t } = useLocale();

  const isDark =
    resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(
          isDark ? "light" : "dark",
        )
      }
      aria-label={
        t.layout.topbar.toggleTheme
      }
      className={topbarItem}
    >
      {isDark ? (
        <span className="text-topbar-info">
          <MoonFillIcon />
        </span>
      ) : (
        <Sun
          aria-hidden="true"
          size={17}
          strokeWidth={2.1}
          className="text-topbar-warning"
        />
      )}
    </button>
  );
}

type NotificationsMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
};

function NotificationsMenu({
  isOpen,
  onToggle,
}: NotificationsMenuProps) {
  const { notifications, unreadCount } =
    useNotifications();

  const { t } = useLocale();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label={
          t.layout.topbar.notifications
        }
        aria-expanded={isOpen}
        className={topbarItem}
      >
        <Bell
          aria-hidden="true"
          size={18}
          strokeWidth={2.05}
        />

        {unreadCount > 0 && (
          <span className="absolute -end-[5px] -top-[6px] flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground ring-[3px] ring-topbar-surface">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="topbar-menu-shadow absolute end-0 top-full z-50 mt-4 w-[340px] rounded-[26px] border border-topbar-border/80 bg-topbar-surface/95 p-4 backdrop-blur-2xl">
          <div className="mb-4">
            <h3 className="text-[14px] font-bold text-topbar-title">
              {
                t.layout.topbar
                  .notificationsTitle
              }
            </h3>

            <p className="mt-1 text-[12px] text-topbar-subtle">
              {t.layout.topbar.unreadUpdates.replace(
                "{{count}}",
                String(unreadCount),
              )}
            </p>
          </div>

          <div className="scrollbar-thin max-h-[280px] space-y-2 overflow-y-auto pe-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="rounded-[18px] bg-topbar-soft p-3 transition hover:bg-topbar-soft-hover"
              >
                <p className="truncate text-[12px] font-bold text-topbar-text">
                  {item.title}
                </p>

                <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-topbar-subtle">
                  {item.description}
                </p>

                <p className="mt-1 text-[11px] text-topbar-muted">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type ProfileMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

function ProfileMenu({
  isOpen,
  onToggle,
  onClose,
}: ProfileMenuProps) {
  const navigate = useNavigate();
  const { t } = useLocale();
  const { user } = useCurrentUser();
  const logoutMutation = useLogout();

  const fullName =
    "fullName" in user
      ? user.fullName
      : `${user.firstName} ${user.lastName}`.trim();

  const photoUrl =
    "avatarUrl" in user
      ? user.avatarUrl
      : user.photoUrl;

  const roleLabel = getRoleLabel(user);

  function openProfilePage() {
    onClose();
    navigate("/profile");
  }

  function handleLogout() {
    onClose();
    logoutMutation.mutate();
  }

  return (
    <div className="relative hidden lg:block">
      <button
        type="button"
        onClick={onToggle}
        aria-label={
          t.layout.topbar.openProfileMenu
        }
        aria-expanded={isOpen}
        className="topbar-item-shadow flex h-[44px] items-center gap-[10px] rounded-[16px] border border-topbar-border bg-topbar-surface/92 py-[5px] pe-[6px] ps-[7px] backdrop-blur-xl"
      >
        <img
          src={photoUrl}
          alt={fullName}
          className="h-[34px] w-[34px] rounded-full object-cover ring-[2px] ring-topbar-surface"
        />

        <span className="flex min-w-0 max-w-[120px] flex-col text-start">
          <span className="truncate text-[12px] font-bold leading-[15px] text-topbar-text">
            {fullName}
          </span>

          <span className="truncate text-[10px] font-semibold leading-[14px] text-topbar-muted">
            {roleLabel}
          </span>
        </span>

        <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[12px] text-topbar-text">
          <ChevronDown
            aria-hidden="true"
            size={15}
            strokeWidth={2.3}
          />
        </span>
      </button>

      {isOpen && (
        <div className="topbar-menu-shadow absolute end-0 top-full z-50 mt-4 w-[255px] rounded-[26px] border border-topbar-border/80 bg-topbar-surface/95 p-[18px] backdrop-blur-2xl">
          <div className="mb-[20px] flex items-center gap-[9px] px-1 text-[12px] font-medium text-topbar-subtle">
            <span className="h-[7px] w-[7px] rounded-full bg-topbar-success" />
            {t.layout.topbar.online}
          </div>

          <div className="space-y-[8px]">
            <ProfileMenuItem
              title={
                t.layout.topbar.viewProfile
              }
              icon={Eye}
              onClick={openProfilePage}
            />

            <ProfileMenuItem
              title={
                t.layout.topbar
                  .changePassword
              }
              icon={ShieldCheck}
              onClick={() => {
                onClose();
                navigate("/profile");
              }}
            />

            {roleLabel === "Super Admin" ? (
              <ProfileMenuItem
                title={
                  t.layout.topbar.manageUsers
                }
                icon={Settings}
                onClick={() => {
                  onClose();
                  navigate("/users/students");
                }}
              />
            ) : null}
          </div>

          <div className="mt-[18px] border-t border-topbar-divider pt-[14px]">
            <button
              type="button"
              onClick={handleLogout}
              disabled={
                logoutMutation.isPending
              }
              className="flex h-[44px] w-full items-center gap-[13px] rounded-[15px] px-[10px] text-start text-[13px] font-bold text-topbar-danger transition hover:bg-topbar-danger-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[12px] bg-topbar-danger-icon text-topbar-danger">
                <LogOut
                  aria-hidden="true"
                  size={16}
                  strokeWidth={2.1}
                />
              </span>

              {logoutMutation.isPending
                ? t.common.loading
                : t.layout.topbar.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type ProfileMenuItemProps = {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
};

function ProfileMenuItem({
  title,
  icon: Icon,
  onClick,
}: ProfileMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[44px] w-full items-center gap-[13px] rounded-[15px] px-[10px] text-start text-[13px] font-semibold text-topbar-text transition hover:bg-topbar-soft"
    >
      <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[12px] bg-topbar-soft text-topbar-text">
        <Icon
          aria-hidden="true"
          size={16}
          strokeWidth={2.05}
        />
      </span>

      {title}
    </button>
  );
}

export function Topbar() {
  const location = useLocation();
  const { t } = useLocale();

  const openMobileSidebar =
    useLayoutStore(
      (state) =>
        state.openMobileSidebar,
    );

  const { user } = useCurrentUser();

  const fullName =
    "fullName" in user
      ? user.fullName
      : `${user.firstName} ${user.lastName}`.trim();

  const photoUrl =
    "avatarUrl" in user
      ? user.avatarUrl
      : user.photoUrl;

  const [
    isNotificationsOpen,
    setIsNotificationsOpen,
  ] = useState(false);

  const [
    isProfileMenuOpen,
    setIsProfileMenuOpen,
  ] = useState(false);

  function toggleNotifications() {
    setIsNotificationsOpen(
      (value) => !value,
    );

    setIsProfileMenuOpen(false);
  }

  function toggleProfileMenu() {
    setIsProfileMenuOpen(
      (value) => !value,
    );

    setIsNotificationsOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 pb-4 pt-4">
      <div className="flex h-[44px] w-full items-center justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={openMobileSidebar}
            aria-label={
              t.layout.topbar.openSidebar
            }
            className={`${topbarItem} lg:hidden`}
          >
            <Menu
              aria-hidden="true"
              size={20}
              strokeWidth={2.1}
            />
          </button>

          <TopbarBreadcrumb
            pathname={location.pathname}
          />
        </div>

        <div className="flex shrink-0 items-center gap-[12px]">
          <NotificationsMenu
            isOpen={isNotificationsOpen}
            onToggle={toggleNotifications}
          />

          <div className="w-[16px]" />

          <LanguageToggle />

          <ThemeButton />

          <div className="w-[8px]" />

          <ProfileMenu
            isOpen={isProfileMenuOpen}
            onToggle={toggleProfileMenu}
            onClose={() =>
              setIsProfileMenuOpen(false)
            }
          />

          <button
            type="button"
            onClick={toggleProfileMenu}
            aria-label={
              t.layout.topbar.openProfileMenu
            }
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full lg:hidden"
          >
            <img
              src={photoUrl}
              alt={fullName}
              className="h-[42px] w-[42px] rounded-full object-cover ring-[2px] ring-topbar-surface"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Eye,
  LogOut,
  Settings,
  ShieldCheck,
  Sun,
} from "lucide-react";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useLocation, useNavigate } from "react-router-dom";

import { useCurrentUser } from "@/app/layouts/dashboard/hooks/useCurrentUser";
import { useNotifications } from "@/app/layouts/dashboard/hooks/useNotifications";
import { LanguageToggle } from "@/shared/components/locale";

const topbarItem =
  "relative flex h-[44px] w-[44px] items-center justify-center rounded-[14px] bg-white/92 text-[#080A2A] shadow-[0_16px_38px_rgba(46,38,108,0.10)] ring-1 ring-[#EEF0FA] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:bg-white";

function MoonFillIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSectionTitle(pathname: string) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/users")) return "Users";
  if (pathname.startsWith("/academics")) return "Academic";
  if (pathname.startsWith("/attendance")) return "Attendance";
  if (pathname.startsWith("/scheduling")) return "Scheduling";
  if (pathname.startsWith("/finance")) return "Finance";
  if (pathname.startsWith("/communication")) return "Communication";
  if (pathname.startsWith("/reports")) return "Reports";
  if (pathname.startsWith("/settings")) return "Settings";

  return "Dashboard";
}

function getCurrentPageTitle(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return "Overview";
  return formatSegment(segments[1]);
}

function TopbarBreadcrumb({ pathname }: { pathname: string }) {
  return (
    <div className="hidden min-w-0 items-center gap-[13px] lg:flex">
      <h1 className="truncate text-[15px] font-bold tracking-[-0.02em] text-[#090A2D]">
        {getSectionTitle(pathname)}
      </h1>

      <ChevronRight
        size={14}
        strokeWidth={1.9}
        className="shrink-0 text-[#C3C4D7]"
      />

      <span className="inline-flex h-[34px] max-w-[150px] shrink-0 items-center rounded-[12px] bg-[#F7F7FE] px-[17px] text-[12px] font-semibold text-[#252543] shadow-[inset_0_0_0_1px_rgba(235,236,248,0.9)]">
        {getCurrentPageTitle(pathname)}
      </span>
    </div>
  );
}

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative flex h-[44px] w-[78px] items-center rounded-[15px] bg-white/92 p-[5px] shadow-[0_16px_38px_rgba(46,38,108,0.10)] ring-1 ring-[#EEF0FA] backdrop-blur-xl"
    >
      <span
        className={[
          "absolute top-[5px] h-[34px] w-[34px] rounded-[12px] shadow-[0_10px_22px_rgba(46,38,108,0.16)] transition-all duration-300",
          isDark ? "left-[39px] bg-[#317CE8]" : "left-[5px] bg-[#FFF4D8]",
        ].join(" ")}
      />

      <span className="relative z-10 flex h-[34px] w-[34px] items-center justify-center rounded-[12px] text-[#F5A623]">
        <Sun size={16} strokeWidth={2.1} />
      </span>

      <span
        className={[
          "relative z-10 flex h-[34px] w-[34px] items-center justify-center rounded-[12px]",
          isDark ? "text-white" : "text-[#317CE8]",
        ].join(" ")}
      >
        <MoonFillIcon />
      </span>
    </button>
  );
}

function NotificationsMenu({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { notifications, unreadCount } = useNotifications();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Notifications"
        className={topbarItem}
      >
        <Bell size={18} strokeWidth={2.05} />

        {unreadCount > 0 && (
          <span className="absolute -right-[5px] -top-[6px] flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#6C45FF] px-1 text-[10px] font-bold leading-none text-white ring-[3px] ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-4 w-[340px] rounded-[26px] border border-white/80 bg-white/95 p-4 shadow-[0_30px_80px_rgba(37,31,92,0.18)] backdrop-blur-2xl">
          <div className="mb-4">
            <h3 className="text-[14px] font-bold text-[#090A2D]">
              Notifications
            </h3>
            <p className="mt-1 text-[12px] text-[#7F8198]">
              You have {unreadCount} unread updates
            </p>
          </div>

          <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1 scrollbar-thin">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="rounded-[18px] bg-[#F8F8FE] p-3 transition hover:bg-[#F3F0FF]"
              >
                <p className="truncate text-[12px] font-bold text-[#111232]">
                  {item.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#777991]">
                  {item.description}
                </p>
                <p className="mt-1 text-[11px] text-[#A0A1B4]">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu({
  isOpen,
  onToggle,
  onClose,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  function openProfilePage() {
    onClose();
    navigate("/profile");
  }

  return (
    <div className="relative hidden lg:block">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-[44px] items-center gap-[10px] rounded-[16px] bg-white/92 py-[5px] pl-[7px] pr-[6px] shadow-[0_16px_38px_rgba(46,38,108,0.10)] ring-1 ring-[#EEF0FA] backdrop-blur-xl"
      >
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          className="h-[34px] w-[34px] rounded-full object-cover ring-[2px] ring-white"
        />

        <span className="flex min-w-0 max-w-[120px] flex-col text-left">
          <span className="truncate text-[12px] font-bold leading-[15px] text-[#111232]">
            {user.fullName}
          </span>

          <span className="truncate text-[10px] font-semibold leading-[14px] text-[#8A8BA0]">
            {user.role}
          </span>
        </span>

        <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[12px] text-[#111232]">
          <ChevronDown size={15} strokeWidth={2.3} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-4 w-[255px] rounded-[26px] border border-white/80 bg-white/95 p-[18px] shadow-[0_30px_80px_rgba(37,31,92,0.18)] backdrop-blur-2xl">
          <div className="mb-[20px] flex items-center gap-[9px] px-1 text-[12px] font-medium text-[#7B7D92]">
            <span className="h-[7px] w-[7px] rounded-full bg-[#22C55E]" />
            Online
          </div>

          <div className="space-y-[8px]">
            <ProfileMenuItem
              title="View Profile"
              icon={Eye}
              onClick={openProfilePage}
            />
            <ProfileMenuItem title="Account Settings" icon={Settings} />
            <ProfileMenuItem title="Security" icon={ShieldCheck} />
            <ProfileMenuItem title="Help & Support" icon={CircleHelp} />
          </div>

          <div className="mt-[18px] border-t border-[#ECECF6] pt-[14px]">
            <button
              type="button"
              className="flex h-[44px] w-full items-center gap-[13px] rounded-[15px] px-[10px] text-left text-[13px] font-bold text-[#FF3B4E] transition hover:bg-[#FFF0F1]"
            >
              <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[12px] bg-[#FFECEF] text-[#FF3B4E]">
                <LogOut size={16} strokeWidth={2.1} />
              </span>
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenuItem({
  title,
  icon: Icon,
  onClick,
}: {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[44px] w-full items-center gap-[13px] rounded-[15px] px-[10px] text-left text-[13px] font-semibold text-[#151634] transition hover:bg-[#F7F6FF]"
    >
      <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[12px] bg-[#F3F2FB] text-[#171734]">
        <Icon size={16} strokeWidth={2.05} />
      </span>

      {title}
    </button>
  );
}

export function Topbar() {
  const location = useLocation();
  const { user } = useCurrentUser();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  function toggleNotifications() {
    setIsNotificationsOpen((value) => !value);
    setIsProfileMenuOpen(false);
  }

  function toggleProfileMenu() {
    setIsProfileMenuOpen((value) => !value);
    setIsNotificationsOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 pb-4 pt-4">
      <div className="flex h-[44px] w-full items-center justify-between">
        <div className="flex min-w-0 flex-1 items-center">
          <TopbarBreadcrumb pathname={location.pathname} />
        </div>

        <div className="flex shrink-0 items-center">
          <div className="flex items-center gap-[13px]">
            <button type="button" className={topbarItem} aria-label="Calendar">
              <CalendarDays size={18} strokeWidth={2.05} />
            </button>

            <NotificationsMenu
              isOpen={isNotificationsOpen}
              onToggle={toggleNotifications}
            />
          </div>

          <div className="w-[34px]" />

          <div className="flex items-center gap-[12px]">
            <LanguageToggle />

            <ThemeSwitch />

            <div className="w-[8px]" />

            <ProfileMenu
              isOpen={isProfileMenuOpen}
              onToggle={toggleProfileMenu}
              onClose={() => setIsProfileMenuOpen(false)}
            />

            <button
              type="button"
              onClick={toggleProfileMenu}
              aria-label="Open profile menu"
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full lg:hidden"
            >
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-[42px] w-[42px] rounded-full object-cover ring-[2px] ring-white"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
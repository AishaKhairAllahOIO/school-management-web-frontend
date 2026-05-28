import {
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import { useLocation } from "react-router-dom";

import { useCurrentUser } from "@/app/layouts/dashboard/hooks/useCurrentUser";
import { useNotifications } from "@/app/layouts/dashboard/hooks/useNotifications";
import { useLayoutStore } from "@/app/layouts/dashboard/store/layoutStore";

import { LanguageToggle } from "@/shared/components/locale";
import { ThemeToggle } from "@/shared/components/theme";

function formatSegment(value?: string) {
  if (!value) return "";

  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSectionTitle(pathname: string) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/users")) return "User Management";
  if (pathname.startsWith("/academics")) return "Academic Management";
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

export function Topbar() {
  const location = useLocation();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { user } = useCurrentUser();
  const { notifications, unreadCount } = useNotifications();

  const toggleMobileSidebar = useLayoutStore(
    (state) => state.toggleMobileSidebar
  );

  const openProfilePanel = useLayoutStore(
    (state) => state.openProfilePanel
  );

  const sectionTitle = getSectionTitle(location.pathname);
  const currentPageTitle = getCurrentPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-40 px-4 pb-2 pt-4 md:px-6 lg:px-8">
      <div className="mx-auto flex h-11 w-full max-w-[1440px] items-center justify-between">
        <div className="flex min-w-0 items-center gap-5">
          <button
            type="button"
            onClick={toggleMobileSidebar}
            aria-label="Open mobile sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-foreground transition hover:bg-muted lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-[20px] font-semibold tracking-[-0.03em] text-foreground">
              {sectionTitle}
            </h1>

            <ChevronRight
              size={15}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/45"
            />

            <span className="inline-flex h-7 items-center rounded-full bg-primary/10 px-3 text-[11px] font-medium text-primary">
              {currentPageTitle}
            </span>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LanguageToggle />

          <ThemeToggle />

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen((value) => !value)}
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-soft transition hover:bg-muted"
            >
              <Bell size={17} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground ring-2 ring-background">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-[22rem] rounded-3xl border border-border/70 bg-card p-4 shadow-floating">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Notifications
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      You have {unreadCount} unread updates
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="max-h-[18rem] space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-background/80 p-3 transition hover:bg-muted/70"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                            item.isUnread ? "bg-primary" : "bg-muted",
                          ].join(" ")}
                        />

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-foreground">
                            {item.title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </p>

                          <p className="mt-1 text-[11px] text-muted-foreground/70">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden items-center gap-2 pl-2 lg:flex">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-background"
            />

            <div className="flex min-w-[120px] flex-col text-left">
              <span className="truncate text-sm font-semibold leading-5 text-foreground">
                {user.fullName}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {user.role}
              </span>
            </div>

            <button
              type="button"
              onClick={openProfilePanel}
              aria-label="Open profile menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-soft transition hover:bg-muted hover:text-foreground"
            >
              <ChevronDown size={15} />
            </button>
          </div>

          <button
            type="button"
            onClick={openProfilePanel}
            className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          >
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
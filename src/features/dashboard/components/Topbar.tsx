import { Bell, Globe2, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useLocation } from "react-router-dom";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useNotifications } from "../hooks/useNotifications";
import { useLayoutStore } from "../store/layoutStore";

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
  if (pathname.startsWith("/logout")) return "Logout";

  return "Dashboard";
}

export function Topbar() {
  const location = useLocation();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { user } = useCurrentUser();
  const { notifications, unreadCount } = useNotifications();

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleMobileSidebar = useLayoutStore(
    (state) => state.toggleMobileSidebar
  );

  const toggleProfilePanel = useLayoutStore(
    (state) => state.toggleProfilePanel
  );

  const isProfilePanelOpen = useLayoutStore(
    (state) => state.isProfilePanelOpen
  );

  const language = useLayoutStore((state) => state.language);
  const toggleLanguage = useLayoutStore((state) => state.toggleLanguage);

  const sectionTitle = getSectionTitle(location.pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl md:px-6 lg:px-8">
      <div className="flex h-11 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="interactive flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-foreground hover:bg-muted lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-foreground">
              {sectionTitle}
            </h1>

            <p className="hidden text-xs text-muted-foreground sm:block">
              Manage this section easily
            </p>
          </div>
        </div>

        <div
          className={[
            "ml-auto flex items-center gap-3 transition-all duration-300 ease-out",
            isProfilePanelOpen ? "lg:mr-[320px]" : "",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={toggleLanguage}
            className="interactive flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border border-border/70 bg-card/90 px-3 text-foreground shadow-soft hover:bg-muted"
            title="Language"
          >
            <Globe2 size={16} />

            <span className="text-[11px] font-bold uppercase">
              {language}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="interactive flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/90 text-foreground shadow-soft hover:bg-muted"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen((value) => !value)}
              className="interactive relative flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/90 text-foreground shadow-soft hover:bg-muted"
              title="Notifications"
            >
              <Bell size={17} />

              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="fade-in absolute right-0 mt-3 w-80 rounded-[24px] border border-border/70 bg-card/95 p-4 shadow-soft-lg backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {language === "en" ? "Notifications" : "الإشعارات"}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      {language === "en"
                        ? `You have ${unreadCount} unread updates`
                        : `لديك ${unreadCount} تحديثات غير مقروءة`}
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

                <div className="space-y-2">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="interactive rounded-2xl bg-background/80 p-3 hover:bg-muted/70"
                    >
                      <div className="flex items-start gap-3">
                        {item.isUnread && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}

                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </p>

                          <p className="mt-1 text-[11px] text-text-light">
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

          {!isProfilePanelOpen && (
            <button
              type="button"
              onClick={toggleProfilePanel}
              className="interactive flex h-10 w-10 items-center justify-center rounded-full bg-card/90 shadow-soft ring-1 ring-border/70 hover:scale-105"
              title="Open profile"
            >
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-9 w-9 rounded-full object-cover"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
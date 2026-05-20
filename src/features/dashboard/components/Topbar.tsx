import { Bell, Globe2, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

import { useLayoutStore } from "../store/layoutStore";

const notifications = [
  {
    title: "New student registration",
    description: "A new student account needs review.",
    time: "5 min ago",
  },
  {
    title: "Payment reminder",
    description: "Some invoices are still pending.",
    time: "18 min ago",
  },
  {
    title: "Attendance alert",
    description: "One class has repeated absences.",
    time: "1 hour ago",
  },
];

export function Topbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl md:px-6 lg:px-8">
      <div className="flex h-11 items-center justify-between gap-4">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="interactive flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-foreground hover:bg-muted lg:hidden"
        >
          <Menu size={18} />
        </button>

        <div
          className={[
            "ml-auto flex items-center gap-3 transition-all duration-300 ease-out",
            isProfilePanelOpen ? "lg:mr-[320px]" : "",
          ].join(" ")}
        >
          <div className="interactive hidden h-10 w-64 items-center gap-2 rounded-2xl bg-card/90 px-3 shadow-soft ring-1 ring-border/60 transition-all focus-within:ring-2 focus-within:ring-primary/20 md:flex lg:w-72">
            <Search size={16} className="shrink-0 text-muted-foreground" />

            <input
              type="text"
              placeholder={language === "en" ? "Search anything..." : "ابحث هنا..."}
              className="w-full border-0 bg-transparent text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            />
          </div>

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

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
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
                        ? "You have 3 unread updates"
                        : "لديك 3 تحديثات غير مقروءة"}
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
                      key={item.title}
                      className="interactive rounded-2xl bg-background/80 p-3 hover:bg-muted/70"
                    >
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
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Aisha Khairallah"
                className="h-9 w-9 rounded-full object-cover"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
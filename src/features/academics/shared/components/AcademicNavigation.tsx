import { ChevronRight } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { academicNavigationGroups } from "../config/academic-navigation";

function getActiveGroup(pathname: string) {
  return (
    academicNavigationGroups.find((group) =>
      group.items.some((item) =>
        pathname.startsWith(item.path),
      ),
    ) ?? academicNavigationGroups[0]
  );
}

export function AcademicNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeGroup = getActiveGroup(
    location.pathname,
  );

  return (
    <div className="space-y-4">
      <section
        aria-label="Academic categories"
        className="rounded-3xl border border-border/70 bg-card p-2 shadow-soft"
      >
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {academicNavigationGroups.map((group) => {
            const Icon = group.icon;
            const isActive =
              group.id === activeGroup.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() =>
                  navigate(group.items[0].path)
                }
                className={[
                  "group relative flex min-h-[78px] items-center gap-3 rounded-2xl px-4 text-left transition",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition",
                    isActive
                      ? "border-primary/20 bg-card text-primary shadow-sm"
                      : "border-border/70 bg-background text-muted-foreground group-hover:text-primary",
                  ].join(" ")}
                >
                  <Icon size={20} />
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-bold">
                    {group.label}
                  </span>
                  <span className="mt-1 block truncate text-[11px] font-medium opacity-75">
                    {group.description}
                  </span>
                </span>

                {isActive ? (
                  <span className="absolute inset-x-6 -bottom-2 h-1 rounded-full bg-primary" />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <section
        aria-label={`${activeGroup.label} pages`}
        className="rounded-3xl border border-border/70 bg-card px-3 py-2 shadow-soft"
      >
        <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeGroup.items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "group relative flex min-w-max items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}

          <ChevronRight
            size={16}
            className="ml-auto hidden shrink-0 text-muted-foreground xl:block"
          />
        </div>
      </section>
    </div>
  );
}

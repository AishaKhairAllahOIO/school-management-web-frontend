import { ChevronRight } from "lucide-react";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

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
    <nav
      aria-label="Academic navigation"
      className="w-full min-w-0 space-y-3"
    >
      <section
        aria-label="Academic categories"
        className={[
          "w-full min-w-0 overflow-hidden",
          "rounded-[28px]",
          "border border-border/60",
          "bg-card/95",
          "shadow-[0_10px_35px_rgba(38,24,84,0.05)]",
          "backdrop-blur-sm",
        ].join(" ")}
      >
        <div className="w-full min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid h-[104px] min-w-[720px] grid-cols-3">
            {academicNavigationGroups.map(
              (group, index) => {
                const Icon = group.icon;

                const isActive =
                  group.id === activeGroup.id;

                const hasDivider =
                  index <
                  academicNavigationGroups.length -
                    1;

                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        group.items[0].path,
                      )
                    }
                    aria-current={
                      isActive
                        ? "page"
                        : undefined
                    }
                    className={[
                      "group relative",
                      "flex h-[104px] min-w-0",
                      "items-center gap-4 overflow-hidden",
                      "px-7 text-left",
                      "transition-all duration-200 ease-out",
                      "focus-visible:z-10",
                      "focus-visible:outline-none",
                      "focus-visible:ring-4",
                      "focus-visible:ring-inset",
                      "focus-visible:ring-primary/10",
                      hasDivider
                        ? "border-r border-border/60"
                        : "",
                      isActive
                        ? [
                            "bg-primary/[0.055]",
                            "text-primary",
                          ].join(" ")
                        : [
                            "text-foreground",
                            "hover:bg-muted/35",
                          ].join(" "),
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-14 w-14 shrink-0",
                        "items-center justify-center",
                        "rounded-2xl border",
                        "transition-all duration-200",
                        isActive
                          ? [
                              "border-primary/15",
                              "bg-primary/[0.08]",
                              "text-primary",
                            ].join(" ")
                          : [
                              "border-border/65",
                              "bg-background/80",
                              "text-muted-foreground",
                              "group-hover:border-primary/10",
                              "group-hover:text-foreground",
                            ].join(" "),
                      ].join(" ")}
                    >
                      <Icon
                        size={24}
                        strokeWidth={1.7}
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={[
                          "block truncate",
                          "text-[15px] font-medium",
                          "leading-5",
                          "transition-colors duration-200",
                          isActive
                            ? "text-primary"
                            : "text-foreground",
                        ].join(" ")}
                      >
                        {group.label}
                      </span>

                      <span
                        className={[
                          "mt-1.5 block h-10",
                          "max-w-[230px] overflow-hidden",
                          "text-[12px] font-normal leading-5",
                          "text-muted-foreground",
                        ].join(" ")}
                      >
                        {group.description}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={[
                        "absolute bottom-0",
                        "left-[20%] right-[20%]",
                        "h-[2px] origin-center",
                        "rounded-full bg-primary",
                        "transition-transform duration-200",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0",
                      ].join(" ")}
                    />
                  </button>
                );
              },
            )}
          </div>
        </div>
      </section>

      <section
        aria-label={`${activeGroup.label} pages`}
        className={[
          "h-[72px] w-full min-w-0",
          "overflow-hidden rounded-[28px]",
          "border border-border/60",
          "bg-card/95 px-3",
          "shadow-[0_10px_35px_rgba(38,24,84,0.05)]",
          "backdrop-blur-sm",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-full w-full min-w-0",
            "items-center gap-2",
            "overflow-x-auto",
            "[scrollbar-width:none]",
            "[&::-webkit-scrollbar]:hidden",
          ].join(" ")}
        >
          {activeGroup.items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "group relative",
                    "flex h-11 min-w-max",
                    "items-center gap-2.5",
                    "rounded-2xl px-4",
                    "text-[13px] font-medium",
                    "transition-all duration-200 ease-out",
                    "focus-visible:outline-none",
                    "focus-visible:ring-4",
                    "focus-visible:ring-primary/10",
                    isActive
                      ? [
                          "bg-primary/[0.07]",
                          "text-primary",
                        ].join(" ")
                      : [
                          "text-muted-foreground",
                          "hover:bg-muted/45",
                          "hover:text-foreground",
                        ].join(" "),
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={17}
                      strokeWidth={1.75}
                      className={[
                        "shrink-0",
                        "transition-colors duration-200",
                        isActive
                          ? "text-primary"
                          : [
                              "text-muted-foreground",
                              "group-hover:text-foreground",
                            ].join(" "),
                      ].join(" ")}
                    />

                    <span className="whitespace-nowrap">
                      {item.label}
                    </span>

                    <span
                      aria-hidden="true"
                      className={[
                        "absolute bottom-0",
                        "left-4 right-4",
                        "h-[2px] origin-center",
                        "rounded-full bg-primary",
                        "transition-transform duration-200",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0",
                      ].join(" ")}
                    />
                  </>
                )}
              </NavLink>
            );
          })}

          <ChevronRight
            aria-hidden="true"
            size={19}
            strokeWidth={1.7}
            className="ml-auto hidden shrink-0 text-muted-foreground xl:block"
          />
        </div>
      </section>
    </nav>
  );
}
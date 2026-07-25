import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { academicNavigationGroups } from "../../shared/config/academic-navigation";

const groupVisualStyles = {
  structure: {
    topAccent: "bg-primary",
    iconSurface: "bg-primary/[0.09]",
    footerSurface: "bg-primary/[0.045]",
    divider: "border-primary/[0.10]",
  },

  curriculum: {
    topAccent: "bg-info",
    iconSurface: "bg-info/[0.10]",
    footerSurface: "bg-info/[0.05]",
    divider: "border-info/[0.11]",
  },

  teaching: {
    topAccent: "bg-success",
    iconSurface: "bg-success/[0.11]",
    footerSurface: "bg-success/[0.055]",
    divider: "border-success/[0.11]",
  },
} as const;

export function AcademicsOverviewPage() {
  return (
    <section
      aria-label="Academics overview"
      className="-mt-3 min-w-0"
    >
      <div className="flex min-w-0 flex-col gap-2.5">
        {academicNavigationGroups.map((group) => {
          const GroupIcon = group.icon;
          const visualStyle = groupVisualStyles[group.id];

          return (
            <article
              key={group.id}
              className={[
                "relative min-w-0 overflow-hidden rounded-[22px]",
                "border bg-card",
                "shadow-[0_10px_30px_rgba(38,24,84,0.05)]",
                group.color.border,
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "absolute inset-x-0 top-0 z-10 h-[3px]",
                  visualStyle.topAccent,
                ].join(" ")}
              />

              <header
                className={[
                  "flex min-h-[61px] items-center gap-3",
                  "border-b bg-card px-5 py-3 sm:px-6",
                  visualStyle.divider,
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center",
                    "rounded-[13px]",
                    visualStyle.iconSurface,
                    group.color.icon,
                  ].join(" ")}
                >
                  <GroupIcon
                    size={20}
                    strokeWidth={1.9}
                  />
                </span>

                <div className="min-w-0">
                  <h2
                    className={[
                      "text-[15px] font-semibold tracking-[-0.01em]",
                      group.color.accent,
                    ].join(" ")}
                  >
                    {group.label}
                  </h2>

                  <p className="mt-0.5 truncate text-[12px] leading-4 text-muted-foreground">
                    {group.description}
                  </p>
                </div>
              </header>

              <div
                className={[
                  "grid min-w-0 grid-cols-1 divide-y bg-card",
                  "md:grid-cols-3 md:divide-x md:divide-y-0",
                  group.color.divider,
                ].join(" ")}
              >
                {group.items.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <section
                      key={item.path}
                      className="flex min-w-0 flex-col bg-card"
                    >
                      <div className="flex min-h-[78px] min-w-0 items-center gap-3 px-5 py-3">
                        <span
                          className={[
                            "flex h-10 w-10 shrink-0 items-center justify-center",
                            "rounded-[13px]",
                            visualStyle.iconSurface,
                            group.color.icon,
                          ].join(" ")}
                        >
                          <ItemIcon
                            size={19}
                            strokeWidth={1.9}
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[13px] font-semibold leading-5 text-foreground">
                            {item.label}
                          </h3>

                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>

                        <div
                          className={[
                            "shrink-0 border-s ps-3 text-right",
                            visualStyle.divider,
                          ].join(" ")}
                        >
                          <div className="text-[14px] font-semibold leading-4 text-foreground">
                            _
                          </div>

                          <div className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                            Items
                          </div>
                        </div>
                      </div>

                      <Link
                        to={item.path}
                        className={[
                          "group flex min-h-[36px] items-center justify-between",
                          "border-t px-5",
                          "text-[11px] font-semibold",
                          "transition-colors duration-200",
                          "focus-visible:outline-none",
                          "focus-visible:ring-4",
                          "focus-visible:ring-inset",
                          "focus-visible:ring-primary/10",
                          visualStyle.divider,
                          visualStyle.footerSurface,
                          group.color.accent,
                          group.color.buttonHover,
                        ].join(" ")}
                      >
                        <span>View</span>

                        <ArrowRight
                          aria-hidden="true"
                          size={15}
                          strokeWidth={2}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </section>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
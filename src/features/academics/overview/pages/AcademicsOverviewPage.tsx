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

const statisticsItems = new Set([
  "grades",
  "classrooms",
  "subjects",
]);

function normalizeItemLabel(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function shouldShowStatistics(label: string) {
  return statisticsItems.has(
    normalizeItemLabel(label),
  );
}

export function AcademicsOverviewPage() {
  return (
    <section
      aria-label="Academics overview"
      className="-mt-3 min-w-0"
    >
      <div className="flex min-w-0 flex-col gap-3">
        {academicNavigationGroups.map(
          (group) => {
            const GroupIcon = group.icon;
            const visualStyle =
              groupVisualStyles[group.id];

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
                    "flex min-h-[74px] items-center gap-4",
                    "border-b bg-card px-5 py-4 sm:px-6",
                    visualStyle.divider,
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-11 w-11 shrink-0 items-center justify-center",
                      "rounded-2xl",
                      visualStyle.iconSurface,
                      group.color.icon,
                    ].join(" ")}
                  >
                    <GroupIcon
                      size={21}
                      strokeWidth={1.9}
                    />
                  </span>

                  <div className="min-w-0">
                    <h2
                      className={[
                        "text-[19px] font-medium leading-6 tracking-[0.01em]",
                        group.color.accent,
                      ].join(" ")}
                    >
                      {group.label}
                    </h2>

                    <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">
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
                    const showStatistics =
                      shouldShowStatistics(
                        item.label,
                      );

                    return (
                      <section
                        key={item.path}
                        className="flex min-w-0 flex-col bg-card"
                      >
                        <div className="flex min-h-[96px] min-w-0 items-center gap-4 px-5 py-4 sm:px-6">
                          <span
                            className={[
                              "flex h-11 w-11 shrink-0 items-center justify-center",
                              "rounded-2xl",
                              visualStyle.iconSurface,
                              group.color.icon,
                            ].join(" ")}
                          >
                            <ItemIcon
                              size={20}
                              strokeWidth={1.9}
                            />
                          </span>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-[16px] font-medium leading-6 tracking-[0.005em] text-foreground">
                              {item.label}
                            </h3>

                            <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-5 text-muted-foreground">
                              {item.description}
                            </p>
                          </div>

                          {showStatistics ? (
                            <div
                              className={[
                                "min-w-[56px] shrink-0 border-s ps-4 text-right",
                                visualStyle.divider,
                              ].join(" ")}
                            >
                              <div className="text-[18px] font-medium leading-none text-foreground">
                                —
                              </div>

                              <div className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.07em] text-muted-foreground">
                                Items
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <Link
                          to={item.path}
                          className={[
                            "group flex min-h-[42px] items-center justify-between",
                            "border-t px-5 sm:px-6",
                            "text-[13px] font-medium",
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
          },
        )}
      </div>
    </section>
  );
}

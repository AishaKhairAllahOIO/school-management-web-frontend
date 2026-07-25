import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { academicNavigationGroups } from "../../shared/config/academic-navigation";

export function AcademicsOverviewPage() {
  return (
    <section aria-labelledby="academics-overview-title" className="min-w-0">
      <div className="mb-5">
        <h1
          id="academics-overview-title"
          className="text-xl font-semibold tracking-[-0.02em] text-foreground"
        >
          Academics
        </h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Manage the school structure, curriculum and teaching operations.
        </p>
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-3">
        {academicNavigationGroups.map((group) => {
          const GroupIcon = group.icon;
          const firstItemPath = group.items[0]?.path ?? "/academics";

          return (
            <article
              key={group.id}
              className={[
                "flex min-h-[610px] min-w-0 flex-col overflow-hidden",
                "rounded-[24px] border bg-card",
                "shadow-[0_14px_40px_rgba(38,24,84,0.06)]",
                group.color.border,
              ].join(" ")}
            >
              <header
                className={[
                  "flex min-h-[150px] items-center gap-4 border-b px-6 py-7",
                  group.color.border,
                  group.color.header,
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px]",
                    group.color.iconSurface,
                    group.color.icon,
                  ].join(" ")}
                >
                  <GroupIcon size={30} strokeWidth={1.7} />
                </span>

                <div className="min-w-0">
                  <h2
                    className={[
                      "text-[17px] font-semibold tracking-[-0.01em]",
                      group.color.accent,
                    ].join(" ")}
                  >
                    {group.label}
                  </h2>
                  <p className="mt-1.5 max-w-[260px] text-[13px] leading-5 text-muted-foreground">
                    {group.description}
                  </p>
                </div>
              </header>

              <div className="flex flex-1 flex-col divide-y divide-border/65">
                {group.items.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <div
                      key={item.path}
                      className="flex min-h-[130px] items-center gap-4 px-5 py-5"
                    >
                      <span
                        className={[
                          "flex h-13 w-13 shrink-0 items-center justify-center rounded-[17px]",
                          "h-[52px] w-[52px]",
                          group.color.iconSurface,
                          group.color.icon,
                        ].join(" ")}
                      >
                        <ItemIcon size={23} strokeWidth={1.75} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-semibold leading-5 text-foreground">
                          {item.label}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-foreground">_</div>
                          <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                            Items
                          </div>
                        </div>

                        <Link
                          to={item.path}
                          className={[
                            "inline-flex h-9 items-center justify-center rounded-xl border px-3.5",
                            "text-[12px] font-semibold transition-colors duration-200",
                            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10",
                            group.color.button,
                            group.color.buttonHover,
                          ].join(" ")}
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <footer
                className={[
                  "mt-auto flex min-h-[64px] items-center justify-between border-t px-5",
                  group.color.border,
                  group.color.footer,
                ].join(" ")}
              >
                <Link
                  to={firstItemPath}
                  className={[
                    "group inline-flex items-center gap-2 text-[12px] font-medium",
                    group.color.accent,
                  ].join(" ")}
                >
                  View all {group.label.toLowerCase()} modules
                  <ArrowRight
                    size={17}
                    strokeWidth={1.8}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}

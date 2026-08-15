import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { CurriculumOverviewLink } from "../../shared/components/CurriculumOverviewLink";

import { academicNavigationGroups } from "../../shared/config/academic-navigation";
import { useAcademicStatistics } from "../hooks/useAcademicStatistics";
import type { AcademicStatistics } from "../types/academic-statistics.types";

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

type StatisticsItemKey =
  | "grades"
  | "classrooms"
  | "subjects";

function normalizeItemLabel(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function getStatisticsValue(
  label: string,
  statistics: AcademicStatistics | undefined,
): number | undefined {
  if (!statistics) {
    return undefined;
  }

  const key = normalizeItemLabel(
    label,
  ) as StatisticsItemKey;

  const values: Record<StatisticsItemKey, number> = {
    grades: statistics.gradeLevelsCount,
    classrooms: statistics.classRoomsCount,
    subjects: statistics.subjectsCount,
  };

  return values[key];
}

function shouldShowStatistics(label: string) {
  const key = normalizeItemLabel(label);

  return (
    key === "grades" ||
    key === "classrooms" ||
    key === "subjects"
  );
}

function StatisticsValue({
  value,
  isLoading,
  isError,
}: {
  value: number | undefined;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <span
        aria-label="Loading item count"
        className="
          block
          h-[18px]
          w-7
          animate-pulse
          rounded-md
          bg-muted
        "
      />
    );
  }

  return (
    <span
      className="
        text-[17px]
        font-medium
        leading-none
        text-foreground
      "
    >
      {isError || value === undefined ? "—" : value}
    </span>
  );
}

export function AcademicsOverviewPage() {
  const {
    data: statistics,
    isLoading: isStatisticsLoading,
    isError: isStatisticsError,
  } = useAcademicStatistics();

  return (
    <section
      aria-label="Academics overview"
      className="-mt-3 min-w-0"
    >
      <div className="flex min-w-0 flex-col gap-3">

        {/* =========================================================
            Academic Navigation Groups
        ========================================================= */}
        {academicNavigationGroups.map((group) => {
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
              {/* Top Accent */}
              <span
                aria-hidden="true"
                className={[
                  "absolute inset-x-0 top-0 z-10 h-[3px]",
                  visualStyle.topAccent,
                ].join(" ")}
              />

              {/* =====================================================
                  Group Header
              ===================================================== */}
              <header
                className={[
                  "flex min-h-[70px] items-center gap-3.5",
                  "border-b bg-card px-5 py-3.5 sm:px-6",
                  visualStyle.divider,
                ].join(" ")}
              >
                {/* Group Icon */}
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center",
                    "rounded-[15px]",
                    visualStyle.iconSurface,
                    group.color.icon,
                  ].join(" ")}
                >
                  <GroupIcon
                    size={20}
                    strokeWidth={1.9}
                  />
                </span>

                {/* Group Information */}
                <div className="min-w-0">
                  <h2
                    className={[
                      "text-[18px] font-medium leading-6",
                      "tracking-[0.005em]",
                      group.color.accent,
                    ].join(" ")}
                  >
                    {group.label}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[12.5px]
                      leading-[18px]
                      text-muted-foreground
                    "
                  >
                    {group.description}
                  </p>
                </div>
              </header>

              {/* =====================================================
                  Group Items
              ===================================================== */}
              <div
                className={[
                  "grid min-w-0 grid-cols-1 divide-y bg-card",
                  "md:grid-cols-3 md:items-stretch",
                  "md:divide-x md:divide-y-0",
                  group.color.divider,
                ].join(" ")}
              >
                {group.items.map((item) => {
                  const ItemIcon = item.icon;

                  const showStatistics =
                    shouldShowStatistics(item.label);

                  const statisticsValue =
                    getStatisticsValue(
                      item.label,
                      statistics,
                    );

                  return (
                    <section
                      key={item.path}
                      className="
                        flex
                        min-w-0
                        flex-col
                        bg-card
                      "
                    >
                      {/* =================================================
                          Item Content
                      ================================================= */}
                      <div
                        className="
                          flex
                          min-h-[100px]
                          flex-1
                          min-w-0
                          items-center
                          gap-3.5
                          px-5
                          py-4
                          sm:px-6
                        "
                      >
                        {/* Item Icon */}
                        <span
                          className={[
                            "flex h-10 w-10 shrink-0",
                            "items-center justify-center",
                            "rounded-[15px]",
                            visualStyle.iconSurface,
                            group.color.icon,
                          ].join(" ")}
                        >
                          <ItemIcon
                            size={19}
                            strokeWidth={1.9}
                          />
                        </span>

                        {/* Item Information */}
                        <div className="min-w-0 flex-1">
                          <h3
                            className="
                              truncate
                              text-[15px]
                              font-medium
                              leading-[21px]
                              tracking-[0.002em]
                              text-foreground
                            "
                          >
                            {item.label}
                          </h3>

                          <p
                            className="
                              mt-1
                              line-clamp-2
                              text-[12px]
                              leading-[18px]
                              text-muted-foreground
                            "
                          >
                            {item.description}
                          </p>
                        </div>

                        {/* =================================================
                            Statistics
                        ================================================= */}
                        {showStatistics ? (
                          <div
                            className={[
                              "flex min-h-[42px] min-w-[56px]",
                              "shrink-0 flex-col",
                              "items-end justify-center",
                              "border-s ps-4 text-right",
                              visualStyle.divider,
                            ].join(" ")}
                          >
                            <StatisticsValue
                              value={statisticsValue}
                              isLoading={
                                isStatisticsLoading
                              }
                              isError={
                                isStatisticsError
                              }
                            />

                            <div
                              className="
                                mt-1.5
                                text-[8.5px]
                                font-medium
                                uppercase
                                tracking-[0.07em]
                                text-muted-foreground
                              "
                            >
                              Items
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {/* =================================================
                          Manage Button
                      ================================================= */}
                      <Link
                        to={item.path}
                        className={[
                          "group flex h-[44px] min-h-[44px]",
                          "shrink-0 items-center justify-between",
                          "border-t px-5 sm:px-6",
                          "text-[12.5px] font-medium leading-none",
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
                        <span>Manage</span>

                        <ArrowRight
                          aria-hidden="true"
                          size={15}
                          strokeWidth={2}
                          className="
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                            rtl:rotate-180
                            rtl:group-hover:-translate-x-1
                          "
                        />
                      </Link>
                    </section>
                  );
                })}
              </div>
            </article>
          );
        })}

        {/* =============================================================
            Academic Overview
            Pastel Yellow Section
        ============================================================= */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-yellow-200/70
            bg-yellow-50/50
            p-[1px]
            shadow-[0_10px_30px_rgba(234,179,8,0.04)]
          "
        >
          {/* Soft Yellow Accent */}
          <span
            aria-hidden="true"
            className="
              absolute
              inset-x-0
              top-0
              z-10
              h-[3px]
              bg-yellow-300
            "
          />

          <div className="rounded-[21px] bg-yellow-50/30">
            <CurriculumOverviewLink />
          </div>
        </div>
      </div>
    </section>
  );
}
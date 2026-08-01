import {
  BarChart3,
  CalendarClock,
  FilePlus2,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { RecentReportsList } from "../components/RecentReportsList";
import { ReportAnalyticsCard } from "../components/ReportAnalyticsCard";
import { ReportBuilderDialog } from "../components/ReportBuilderDialog";
import { ReportCard } from "../components/ReportCard";
import { ReportMetricCard } from "../components/ReportMetricCard";
import { useReports } from "../hooks/useReports";
import type {
  ReportCategory,
  ReportTemplate,
} from "../types/reports.types";

const categoryOrder: ReportCategory[] = [
  "Students",
  "Academics",
  "Attendance",
  "Staff",
  "Finance",
  "Communications",
];

const allowAllReports = () => true;

type ReportsPageProps = {
  /**
   * Optional permission adapter.
   * Example: <ReportsPage can={(permission) => permissions.includes(permission)} />
   */
  can?: (permission: string) => boolean;
};

export function ReportsPage({ can = allowAllReports }: ReportsPageProps) {
  const reportsQuery = useReports();
  const [selectedCategory, setSelectedCategory] =
    useState<ReportCategory | "All">("All");
  const [searchValue, setSearchValue] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);

  const allowedTemplates = useMemo(() => {
    const templates = reportsQuery.data?.templates ?? [];

    return templates.filter(
      (template) =>
        !template.permission || can(template.permission),
    );
  }, [can, reportsQuery.data?.templates]);

  const filteredTemplates = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return allowedTemplates.filter((template) => {
      const matchesCategory =
        selectedCategory === "All" ||
        template.category === selectedCategory;
      const matchesSearch =
        !query ||
        `${template.title} ${template.description} ${template.category}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [allowedTemplates, searchValue, selectedCategory]);

  if (reportsQuery.isLoading) {
    return <ReportsPageSkeleton />;
  }

  const data = reportsQuery.data;

  if (!data) {
    return (
      <section className="rounded-[22px] border border-border/60 bg-card p-6">
        <h1 className="text-[18px] font-semibold text-foreground">
          Reports are unavailable
        </h1>
        <p className="mt-2 text-[12px] text-muted-foreground">
          The reports workspace could not be loaded.
        </p>
      </section>
    );
  }

  function openFirstTemplate() {
    const firstTemplate =
      filteredTemplates[0] ?? allowedTemplates[0];

    if (firstTemplate) {
      setSelectedTemplate(firstTemplate);
    }
  }

  return (
    <div className="space-y-4">
      <ReportAnalyticsCard onCreate={openFirstTemplate} />

      <section className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_7px_24px_rgba(30,20,70,0.03)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
          {data.metrics.map((metric) => (
            <ReportMetricCard key={metric.title} metric={metric} />
          ))}
        </div>
      </section>

      <section className="rounded-[20px] border border-border/60 bg-card p-3 shadow-[0_7px_24px_rgba(30,20,70,0.03)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <CategoryButton
              label="All reports"
              active={selectedCategory === "All"}
              onClick={() => setSelectedCategory("All")}
              withIcon
            />

            {categoryOrder.map((category) => (
              <CategoryButton
                key={category}
                label={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>

          <label className="relative min-w-0 xl:w-[300px]">
            <Search
              aria-hidden="true"
              size={15}
              className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search reports"
              className="h-10 w-full rounded-[12px] border border-border/60 bg-background/55 ps-9 pe-3 text-[11.5px] text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/25 focus:ring-4 focus:ring-primary/8"
            />
          </label>
        </div>
      </section>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.035)]">
          <header className="flex flex-col gap-2 border-b border-border/45 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-foreground">
                Report library
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {filteredTemplates.length} accessible report
                {filteredTemplates.length === 1 ? "" : "s"}
              </p>
            </div>

            {selectedCategory !== "All" ? (
              <span className="w-fit rounded-full bg-primary/[0.06] px-2.5 py-1 text-[10px] font-medium text-primary">
                {selectedCategory}
              </span>
            ) : null}
          </header>

          {filteredTemplates.length > 0 ? (
            <div className="divide-y divide-border/40">
              {filteredTemplates.map((template) => (
                <ReportCard
                  key={template.id}
                  report={template}
                  onOpen={setSelectedTemplate}
                />
              ))}
            </div>
          ) : (
            <section className="flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-muted/50 text-muted-foreground">
                <Search aria-hidden="true" size={18} />
              </span>
              <h2 className="mt-4 text-[14px] font-semibold text-foreground">
                No accessible reports found
              </h2>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Try another category or search phrase.
              </p>
            </section>
          )}
        </main>

        <aside className="space-y-4 2xl:sticky 2xl:top-5 2xl:self-start">
          <RecentReportsList reports={data.recentReports} />

          <section className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.035)]">
            <header className="border-b border-border/45 px-5 py-4">
              <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-foreground">
                Scheduled reports
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Recurring deliveries configured for leadership.
              </p>
            </header>

            <div className="divide-y divide-border/40">
              <AutomationRow
                icon={CalendarClock}
                title="Monthly leadership pack"
                schedule="First day · 08:00"
              />
              <AutomationRow
                icon={FilePlus2}
                title="Weekly attendance digest"
                schedule="Sunday · 07:30"
              />
            </div>

            <div className="border-t border-border/45 p-3">
              <button
                type="button"
                className="flex h-10 w-full items-center justify-center rounded-[12px] border border-primary/20 bg-transparent text-[11px] font-semibold text-primary transition-colors hover:bg-primary/[0.055]"
              >
                Manage schedules
              </button>
            </div>
          </section>
        </aside>
      </div>

      <ReportBuilderDialog
        report={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </div>
  );
}

function CategoryButton({
  label,
  active,
  onClick,
  withIcon = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  withIcon?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-10 min-w-max items-center gap-2 rounded-[12px] px-3 text-[11.5px] font-medium transition-colors",
        active
          ? "bg-primary/[0.07] text-primary"
          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
      ].join(" ")}
    >
      {withIcon ? (
        <BarChart3 aria-hidden="true" size={15} strokeWidth={1.8} />
      ) : null}
      {label}
    </button>
  );
}

function AutomationRow({
  icon: Icon,
  title,
  schedule,
}: {
  icon: typeof CalendarClock;
  title: string;
  schedule: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-muted/50 text-muted-foreground">
        <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11.5px] font-medium text-foreground">
          {title}
        </p>
        <p className="mt-1 text-[10.5px] text-muted-foreground">
          {schedule}
        </p>
      </div>
      <span className="h-2 w-2 shrink-0 rounded-full bg-success" />
    </div>
  );
}

function ReportsPageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-[86px] rounded-[22px] bg-muted/40" />
      <div className="grid grid-cols-2 overflow-hidden rounded-[20px] border border-border/50 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[72px] border-e border-border/40 bg-muted/30" />
        ))}
      </div>
      <div className="h-[64px] rounded-[20px] bg-muted/35" />
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-[22px] border border-border/50 bg-card">
          <div className="h-[72px] border-b border-border/40 bg-muted/25" />
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-[92px] border-b border-border/35 bg-muted/20" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-[340px] rounded-[22px] bg-muted/35" />
          <div className="h-[230px] rounded-[22px] bg-muted/30" />
        </div>
      </div>
    </div>
  );
}

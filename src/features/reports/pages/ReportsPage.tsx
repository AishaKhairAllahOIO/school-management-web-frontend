import {
  BarChart3,
  CalendarClock,
  FilePlus2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";

import { RecentReportsList } from "../components/RecentReportsList";
import { ReportAnalyticsCard } from "../components/ReportAnalyticsCard";
import { ReportBuilderDialog } from "../components/ReportBuilderDialog";
import { ReportCard } from "../components/ReportCard";
import { ReportMetricCard } from "../components/ReportMetricCard";
import { useReports } from "../hooks/useReports";
import type { ReportCategory, ReportTemplate } from "../types/reports.types";

const categoryOrder: ReportCategory[] = [
  "Students",
  "Academics",
  "Attendance",
  "Staff",
  "Finance",
  "Communications",
];

export function ReportsPage() {
  const reportsQuery = useReports();
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | "All">("All");
  const [searchValue, setSearchValue] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    const templates = reportsQuery.data?.templates ?? [];
    const query = searchValue.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
      const matchesSearch = !query || `${template.title} ${template.description} ${template.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [reportsQuery.data?.templates, searchValue, selectedCategory]);

  const groupedTemplates = useMemo(() => {
    return categoryOrder
      .map((category) => ({
        category,
        templates: filteredTemplates.filter((template) => template.category === category),
      }))
      .filter((group) => group.templates.length > 0);
  }, [filteredTemplates]);

  if (reportsQuery.isLoading) {
    return <ReportsPageSkeleton />;
  }

  const data = reportsQuery.data;

  if (!data) {
    return (
      <section className="rounded-[22px] border border-border/60 bg-card p-6">
        <h1 className="text-[18px] font-semibold text-foreground">Reports are unavailable</h1>
        <p className="mt-2 text-[12px] text-muted-foreground">The reports workspace could not be loaded.</p>
      </section>
    );
  }

  function openFirstTemplate() {
    const firstTemplate = filteredTemplates[0] ?? data.templates[0];
    if (firstTemplate) setSelectedTemplate(firstTemplate);
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ReportAnalyticsCard onCreate={openFirstTemplate} />

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.metrics.map((metric) => (
            <ReportMetricCard key={metric.title} metric={metric} />
          ))}
        </section>
      </section>

      <section className="rounded-[22px] border border-border/60 bg-card p-3 shadow-[0_10px_30px_rgba(30,20,70,0.035)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={[
                "inline-flex h-10 min-w-max items-center gap-2 rounded-[13px] px-3 text-[11px] font-medium transition-all",
                selectedCategory === "All"
                  ? "bg-primary/[0.08] text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              ].join(" ")}
            >
              <BarChart3 aria-hidden="true" size={15} strokeWidth={1.8} />
              All reports
            </button>

            {categoryOrder.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={[
                  "h-10 min-w-max rounded-[13px] px-3 text-[11px] font-medium transition-all",
                  selectedCategory === category
                    ? "bg-primary/[0.08] text-primary"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                ].join(" ")}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex w-full items-center gap-2 xl:w-auto">
            <label className="relative min-w-0 flex-1 xl:w-[280px] xl:flex-none">
              <Search aria-hidden="true" size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search report templates…"
                className="h-10 w-full rounded-[13px] border border-border/60 bg-background/55 ps-9 pe-3 text-[11px] text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/25 focus:ring-4 focus:ring-primary/8"
              />
            </label>
            <button type="button" aria-label="Report filters" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border border-border/60 text-muted-foreground transition hover:bg-muted/40 hover:text-foreground">
              <SlidersHorizontal aria-hidden="true" size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_390px]">
        <main className="space-y-6">
          {groupedTemplates.length > 0 ? (
            groupedTemplates.map((group) => (
              <section key={group.category}>
                <header className="mb-3 flex items-end justify-between gap-4 px-1">
                  <div>
                    <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-foreground">{group.category}</h2>
                    <p className="mt-1 text-[10.5px] text-muted-foreground">
                      {group.templates.length} available {group.templates.length === 1 ? "template" : "templates"}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted/45 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                    {group.category === "Academics" ? "Learning & structure" : group.category === "Finance" ? "Collections & payroll" : "Operational reports"}
                  </span>
                </header>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.templates.map((template) => (
                    <ReportCard key={template.id} report={template} onOpen={setSelectedTemplate} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <section className="flex min-h-[260px] flex-col items-center justify-center rounded-[22px] border border-dashed border-border/70 bg-card p-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-muted/50 text-muted-foreground">
                <Search aria-hidden="true" size={20} />
              </span>
              <h2 className="mt-4 text-[15px] font-semibold text-foreground">No report templates found</h2>
              <p className="mt-2 text-[11px] text-muted-foreground">Try another category or search phrase.</p>
            </section>
          )}
        </main>

        <aside className="space-y-4 2xl:sticky 2xl:top-5 2xl:self-start">
          <RecentReportsList reports={data.recentReports} />

          <section className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[0_10px_30px_rgba(30,20,70,0.035)]">
            <header className="border-b border-border/45 px-5 py-4">
              <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-foreground">Report automation</h2>
              <p className="mt-1 text-[11px] text-muted-foreground">Recurring deliveries for school leadership.</p>
            </header>

            <div className="space-y-3 p-4">
              <div className="flex items-center gap-3 rounded-[16px] border border-border/50 bg-background/55 p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-info/[0.09] text-info">
                  <CalendarClock aria-hidden="true" size={17} strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-foreground">Monthly leadership pack</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Every first day · 08:00</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-success" />
              </div>

              <div className="flex items-center gap-3 rounded-[16px] border border-border/50 bg-background/55 p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-primary/[0.09] text-primary">
                  <FilePlus2 aria-hidden="true" size={17} strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-foreground">Weekly attendance digest</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Every Sunday · 07:30</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-success" />
              </div>

              <button type="button" className="flex h-10 w-full items-center justify-center rounded-[13px] border border-primary/20 bg-primary/[0.05] text-[11px] font-semibold text-primary transition hover:bg-primary/[0.09]">
                Schedule a report
              </button>
            </div>
          </section>
        </aside>
      </div>

      <ReportBuilderDialog report={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
    </div>
  );
}

function ReportsPageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[250px] rounded-[24px] bg-muted/45" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[118px] rounded-[20px] bg-muted/40" />
          ))}
        </div>
      </div>
      <div className="h-[64px] rounded-[22px] bg-muted/35" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[246px] rounded-[20px] bg-muted/40" />
        ))}
      </div>
    </div>
  );
}

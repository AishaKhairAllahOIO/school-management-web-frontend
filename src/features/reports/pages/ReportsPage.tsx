import {
  BarChart3,
  Search,
  FileCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReportAnalyticsCard } from "../components/ReportAnalyticsCard";
import { ReportBuilderDialog } from "../components/ReportBuilderDialog";
import { ReportCard } from "../components/ReportCard";
import { ReportMetricCard } from "../components/ReportMetricCard";
import { RecentReportsList } from "../components/RecentReportsList";
import { StudentAttendanceDetails } from "../components/StudentAttendanceDetails";
import { StaffAttendanceDetails } from "../components/StaffAttendanceDetails";
import { FinanceReportDetails } from "../components/FinanceReportDetails"; // 🌟 استيراد مكون المالية 🌟
import { useReports } from "../hooks/useReports";
import type {
  ReportCategory,
  ReportTemplate,
} from "../types/reports.types";

const categoryOrder: ReportCategory[] = [
  "Attendance",
  "Staff",
  "Finance",
  "Academics",
];

const reportCardsItem = {
  title: "Student Report Cards & Promotions",
  description: "Generate term report cards, publish academic results to parents, and manage annual student promotion.",
};

export function ReportsPage() {
  const navigate = useNavigate();
  const reportsQuery = useReports();
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | "All">("All");
  const [searchValue, setSearchValue] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    const templates = reportsQuery.data?.templates ?? [];
    const query = searchValue.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesCategory =
        selectedCategory === "All" || template.category === selectedCategory;
      const matchesSearch =
        !query ||
        `${template.title} ${template.description} ${template.category}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [reportsQuery.data?.templates, searchValue, selectedCategory]);

  const showReportCardsItem = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const matchesCategory = selectedCategory === "All" || selectedCategory === "Academics"; 
    const matchesSearch = !query || `${reportCardsItem.title} ${reportCardsItem.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }, [searchValue, selectedCategory]);

  const totalAccessibleReports = filteredTemplates.length + (showReportCardsItem ? 1 : 0);

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
    const firstTemplate = filteredTemplates[0] ?? data?.templates[0];
    if (firstTemplate) {
      setSelectedTemplate(firstTemplate);
    }
  }

  const displayedMetrics = selectedCategory === "All"
    ? data.metrics
    : data.metrics.filter((m) => m.category === selectedCategory || !m.category);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <ReportAnalyticsCard onCreate={openFirstTemplate} />

      <section className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_7px_24px_rgba(30,20,70,0.03)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
          {displayedMetrics.map((metric) => (
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

      {selectedCategory === "Attendance" && (
        <StudentAttendanceDetails report={data.studentAttendance} />
      )}

      {selectedCategory === "Staff" && (
        <StaffAttendanceDetails report={data.staffAttendance} />
      )}

      {/* 🌟 تفعيل قسم المالية اللي كان الباك إند عم يبعته ونحنا مو عارضينه 🌟 */}
      {selectedCategory === "Finance" && (
        <div className="grid gap-4 md:grid-cols-2">
          <FinanceReportDetails type="student" report={data.studentFinance} />
          <FinanceReportDetails type="staff" report={data.staffFinance} />
        </div>
      )}

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.035)]">
          <header className="flex flex-col gap-2 border-b border-border/45 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-foreground">
                Report library
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {totalAccessibleReports} accessible report{totalAccessibleReports === 1 ? "" : "s"}
              </p>
            </div>

            {selectedCategory !== "All" && (
              <span className="w-fit rounded-full bg-primary/[0.06] px-2.5 py-1 text-[10px] font-medium text-primary">
                {selectedCategory}
              </span>
            )}
          </header>

          {totalAccessibleReports > 0 ? (
            <div className="divide-y divide-border/40">
              
              {showReportCardsItem && (
                <div className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-muted/15 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4 sm:items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
                      <FileCheck size={20} strokeWidth={1.8} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13.5px] font-semibold text-foreground">
                          {reportCardsItem.title}
                        </h3>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9.5px] font-semibold text-primary uppercase tracking-wider">
                          Academics
                        </span>
                        <span className="rounded-full border border-border/50 bg-muted/20 px-2 py-0.5 text-[9.5px] font-medium text-muted-foreground">
                          Interactive
                        </span>
                      </div>
                      <p className="mt-1 text-[11.5px] text-muted-foreground">
                        {reportCardsItem.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate("/reports/report-cards")}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[10px] border border-primary/20 bg-primary/5 px-4 text-[11.5px] font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                      Manage ↗
                    </button>
                  </div>
                </div>
              )}

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

        {/* 🌟 إخفاء Scheduled Reports والإبقاء على التصديرات الأخيرة فقط 🌟 */}
        <aside className="space-y-4 2xl:sticky 2xl:top-5 2xl:self-start">
          <RecentReportsList />
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
      {withIcon && <BarChart3 aria-hidden="true" size={15} strokeWidth={1.8} />}
      {label}
    </button>
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
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[92px] border-b border-border/35 bg-muted/20" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-[230px] rounded-[22px] bg-muted/30" />
        </div>
      </div>
    </div>
  );
}
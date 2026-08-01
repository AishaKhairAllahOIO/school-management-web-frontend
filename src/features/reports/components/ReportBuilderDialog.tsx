import { Check, ChevronDown, Download, FileSpreadsheet, FileText, Table2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useGenerateReport } from "../hooks/useReports";
import type { ReportFormat, ReportTemplate } from "../types/reports.types";

const formatOptions: Array<{ value: ReportFormat; label: string; icon: typeof FileText }> = [
  { value: "PDF", label: "PDF document", icon: FileText },
  { value: "Excel", label: "Excel workbook", icon: FileSpreadsheet },
  { value: "CSV", label: "CSV data file", icon: Table2 },
];

export function ReportBuilderDialog({
  report,
  onClose,
}: {
  report: ReportTemplate | null;
  onClose: () => void;
}) {
  const [format, setFormat] = useState<ReportFormat>("PDF");
  const [academicYear, setAcademicYear] = useState("2026–2027");
  const [dateRange, setDateRange] = useState("Current term");
  const generateMutation = useGenerateReport();

  useEffect(() => {
    if (!report) return;
    setFormat(report.formats[0] ?? "PDF");
    setAcademicYear("2026–2027");
    setDateRange("Current term");
    generateMutation.reset();
  }, [report]);

  if (!report) return null;

  const Icon = report.icon;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="report-builder-title">
      <div className="max-h-[calc(100vh-32px)] w-full max-w-[720px] overflow-y-auto rounded-[26px] border border-border/60 bg-card shadow-[0_28px_80px_rgba(20,15,55,0.22)]">
        <header className="flex items-start justify-between gap-4 border-b border-border/45 px-6 py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.09] text-primary">
              <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">{report.category} report</p>
              <h2 id="report-builder-title" className="mt-1 truncate text-[18px] font-semibold tracking-[-0.025em] text-foreground">
                {report.title}
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">Configure the export before generation.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close report builder" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-muted-foreground transition hover:bg-muted/50 hover:text-foreground">
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <div className="space-y-6 p-6">
          <section>
            <h3 className="text-[12px] font-semibold text-foreground">Export format</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {formatOptions.filter((option) => report.formats.includes(option.value)).map((option) => {
                const FormatIcon = option.icon;
                const isSelected = option.value === format;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormat(option.value)}
                    className={[
                      "relative flex min-h-[88px] flex-col items-start rounded-[16px] border p-3.5 text-start transition-all",
                      isSelected
                        ? "border-primary/30 bg-primary/[0.06] text-primary shadow-[0_8px_24px_rgba(90,65,200,0.07)]"
                        : "border-border/60 bg-background/55 text-muted-foreground hover:border-primary/15 hover:bg-muted/25",
                    ].join(" ")}
                  >
                    <FormatIcon aria-hidden="true" size={18} strokeWidth={1.8} />
                    <span className="mt-3 text-[12px] font-semibold">{option.value}</span>
                    <span className="mt-1 text-[10px] font-normal opacity-75">{option.label}</span>
                    {isSelected ? (
                      <span className="absolute end-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check aria-hidden="true" size={12} strokeWidth={2.2} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] font-medium text-foreground">Academic year</span>
              <span className="relative mt-2 block">
                <select value={academicYear} onChange={(event) => setAcademicYear(event.target.value)} className="h-11 w-full appearance-none rounded-[14px] border border-border/65 bg-background/60 px-3 pe-10 text-[12px] text-foreground outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/8">
                  <option>2026–2027</option>
                  <option>2025–2026</option>
                </select>
                <ChevronDown aria-hidden="true" size={15} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </span>
            </label>

            <label className="block">
              <span className="text-[11px] font-medium text-foreground">Reporting period</span>
              <span className="relative mt-2 block">
                <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="h-11 w-full appearance-none rounded-[14px] border border-border/65 bg-background/60 px-3 pe-10 text-[12px] text-foreground outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/8">
                  <option>Current term</option>
                  <option>Current month</option>
                  <option>Academic year</option>
                  <option>Custom range</option>
                </select>
                <ChevronDown aria-hidden="true" size={15} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </span>
            </label>
          </section>

          <section className="rounded-[18px] border border-border/55 bg-muted/20 p-4">
            <h3 className="text-[11px] font-semibold text-foreground">Available filters</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {report.filters.map((filter) => (
                <span key={filter} className="rounded-full border border-border/55 bg-card px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground">
                  {filter}
                </span>
              ))}
            </div>
          </section>

          {generateMutation.isSuccess ? (
            <div className="flex items-center gap-3 rounded-[16px] border border-success/20 bg-success/[0.07] p-4 text-success">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                <Check aria-hidden="true" size={16} strokeWidth={2} />
              </span>
              <p className="text-[11px] font-medium">{generateMutation.data.message}</p>
            </div>
          ) : null}
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-border/45 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button type="button" onClick={onClose} className="h-10 rounded-[13px] border border-border/65 px-4 text-[12px] font-medium text-muted-foreground transition hover:bg-muted/35 hover:text-foreground">
            Cancel
          </button>
          <button
            type="button"
            disabled={generateMutation.isPending}
            onClick={() => generateMutation.mutate({ template: report, format, academicYear, dateRange })}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[13px] bg-primary px-4 text-[12px] font-semibold text-primary-foreground shadow-[0_8px_20px_rgba(90,65,200,0.20)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(90,65,200,0.26)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download aria-hidden="true" size={15} strokeWidth={1.9} />
            {generateMutation.isPending ? "Generating…" : `Generate ${format}`}
          </button>
        </footer>
      </div>
    </div>
  );
}

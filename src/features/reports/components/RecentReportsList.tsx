import {
  Download,
  FileClock,
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
  Table2,
} from "lucide-react";

import type { RecentReport, ReportFormat, ReportStatus } from "../types/reports.types";

const statusClasses: Record<ReportStatus, string> = {
  Ready: "bg-success/[0.09] text-success",
  Processing: "bg-warning/[0.10] text-warning",
  Scheduled: "bg-info/[0.09] text-info",
};

const formatIcon: Record<ReportFormat, typeof FileText> = {
  PDF: FileText,
  Excel: FileSpreadsheet,
  CSV: Table2,
};

export function RecentReportsList({ reports }: { reports: RecentReport[] }) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[0_10px_32px_rgba(30,20,70,0.04)]">
      <header className="flex items-start justify-between gap-4 border-b border-border/45 px-5 py-4">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-foreground">Recent exports</h2>
          <p className="mt-1 text-[11px] text-muted-foreground">Latest generated and scheduled files.</p>
        </div>
        <button type="button" aria-label="More report options" className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted-foreground transition hover:bg-muted/50 hover:text-foreground">
          <MoreHorizontal aria-hidden="true" size={17} />
        </button>
      </header>

      <div className="divide-y divide-border/40">
        {reports.map((report) => {
          const FormatIcon = formatIcon[report.format];
          return (
            <article key={report.id} className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/20">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-muted/45 text-muted-foreground">
                {report.status === "Processing" ? (
                  <FileClock aria-hidden="true" size={17} strokeWidth={1.8} />
                ) : (
                  <FormatIcon aria-hidden="true" size={17} strokeWidth={1.8} />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-foreground">{report.title}</p>
                <p className="mt-1 truncate text-[10.5px] text-muted-foreground">
                  {report.category} · {report.format} · {report.date}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-[9.5px] font-semibold ${statusClasses[report.status]}`}>
                  {report.status}
                </span>
                {report.status === "Ready" ? (
                  <button type="button" aria-label={`Download ${report.title}`} className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted-foreground transition hover:bg-primary/[0.07] hover:text-primary">
                    <Download aria-hidden="true" size={15} strokeWidth={1.8} />
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <button type="button" className="flex h-11 w-full items-center justify-center border-t border-border/45 text-[11px] font-medium text-primary transition-colors hover:bg-primary/[0.035]">
        View export history
      </button>
    </section>
  );
}

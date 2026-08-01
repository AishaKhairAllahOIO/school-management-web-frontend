import { ArrowUpRight, FileSpreadsheet, FileText, Table2 } from "lucide-react";

import type { ReportFormat, ReportTemplate, ReportTone } from "../types/reports.types";

const toneClasses: Record<ReportTone, { accent: string; icon: string; action: string; soft: string }> = {
  primary: {
    accent: "bg-primary",
    icon: "bg-primary/[0.09] text-primary",
    action: "text-primary group-hover:bg-primary/[0.07]",
    soft: "bg-primary/[0.035]",
  },
  info: {
    accent: "bg-info",
    icon: "bg-info/[0.10] text-info",
    action: "text-info group-hover:bg-info/[0.07]",
    soft: "bg-info/[0.035]",
  },
  success: {
    accent: "bg-success",
    icon: "bg-success/[0.10] text-success",
    action: "text-success group-hover:bg-success/[0.07]",
    soft: "bg-success/[0.035]",
  },
  warning: {
    accent: "bg-warning",
    icon: "bg-warning/[0.11] text-warning",
    action: "text-warning group-hover:bg-warning/[0.08]",
    soft: "bg-warning/[0.04]",
  },
  destructive: {
    accent: "bg-destructive",
    icon: "bg-destructive/[0.09] text-destructive",
    action: "text-destructive group-hover:bg-destructive/[0.07]",
    soft: "bg-destructive/[0.035]",
  },
  secondary: {
    accent: "bg-secondary-foreground",
    icon: "bg-secondary text-secondary-foreground",
    action: "text-secondary-foreground group-hover:bg-secondary",
    soft: "bg-secondary/50",
  },
};

const formatIcon: Record<ReportFormat, typeof FileText> = {
  PDF: FileText,
  Excel: FileSpreadsheet,
  CSV: Table2,
};

export function ReportCard({
  report,
  onOpen,
}: {
  report: ReportTemplate;
  onOpen: (report: ReportTemplate) => void;
}) {
  const Icon = report.icon;
  const tone = toneClasses[report.tone];

  return (
    <article className="group relative flex min-h-[246px] flex-col overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-[0_16px_38px_rgba(30,20,70,0.075)]">
      <span aria-hidden className={`absolute inset-x-0 top-0 h-[3px] ${tone.accent}`} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${tone.icon}`}>
            <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
          </span>

          {report.featured ? (
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${tone.soft} ${tone.action.split(" ")[0]}`}>
              Recommended
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-[16px] font-semibold leading-5 tracking-[-0.02em] text-foreground">
          {report.title}
        </h3>
        <p className="mt-2 line-clamp-3 min-h-[54px] text-[12px] leading-[18px] text-muted-foreground">
          {report.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
          {report.formats.map((format) => {
            const FormatIcon = formatIcon[format];
            return (
              <span key={format} className="inline-flex h-7 items-center gap-1.5 rounded-[9px] border border-border/55 bg-background/80 px-2 text-[10px] font-medium text-muted-foreground">
                <FormatIcon aria-hidden="true" size={12} strokeWidth={1.8} />
                {format}
              </span>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(report)}
        className={`flex h-12 shrink-0 items-center justify-between border-t border-border/40 px-5 text-[12px] font-medium transition-colors ${tone.soft} ${tone.action}`}
      >
        <span>Build report</span>
        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </article>
  );
}

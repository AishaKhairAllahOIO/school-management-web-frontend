import {
  ArrowUpRight,
  FileJson,
  FileText,
  Table2,
} from "lucide-react";

import type {
  ReportFormat,
  ReportTemplate,
  ReportTone,
} from "../types/reports.types";

const toneClasses: Record<ReportTone, { icon: string; category: string }> = {
  primary: {
    icon: "bg-primary/[0.08] text-primary",
    category: "bg-primary/[0.06] text-primary",
  },
  info: {
    icon: "bg-info/[0.09] text-info",
    category: "bg-info/[0.07] text-info",
  },
  success: {
    icon: "bg-success/[0.09] text-success",
    category: "bg-success/[0.07] text-success",
  },
  warning: {
    icon: "bg-warning/[0.10] text-warning",
    category: "bg-warning/[0.08] text-warning",
  },
  destructive: {
    icon: "bg-destructive/[0.08] text-destructive",
    category: "bg-destructive/[0.06] text-destructive",
  },
  secondary: {
    icon: "bg-secondary text-secondary-foreground",
    category: "bg-secondary text-secondary-foreground",
  },
};

const formatIcon: Record<ReportFormat, typeof FileText> = {
  PDF: FileText,
  JSON: FileJson,
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
    <article className="group grid gap-4 px-5 py-4 transition-colors hover:bg-muted/[0.16] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="flex min-w-0 items-start gap-3.5">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] ${tone.icon}`}>
          <Icon aria-hidden="true" size={18} strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.015em] text-foreground">
              {report.title}
            </h3>
            <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-medium ${tone.category}`}>
              {report.category}
            </span>
            {report.featured ? (
              <span className="rounded-full border border-border/55 px-2 py-0.5 text-[9.5px] font-medium text-muted-foreground">
                Recommended
              </span>
            ) : null}
          </div>

          <p className="mt-1.5 line-clamp-2 max-w-[760px] text-[11.5px] leading-[18px] text-muted-foreground">
            {report.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 ps-[54px] lg:justify-end lg:ps-0">
        <div className="flex items-center gap-1.5">
          {report.formats.map((format) => {
            const FormatIcon = formatIcon[format];
            return (
              <span
                key={format}
                title={format}
                className="flex h-7 w-7 items-center justify-center rounded-[9px] border border-border/55 bg-background/60 text-muted-foreground"
              >
                <FormatIcon aria-hidden="true" size={12.5} strokeWidth={1.8} />
              </span>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onOpen(report)}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-[12px] border border-primary/20 bg-transparent px-3 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/[0.055] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
        >
          Build
          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  );
}
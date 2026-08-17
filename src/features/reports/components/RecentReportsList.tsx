import {
  FileBarChart2,
  FileText,
  Table2,
  FileJson,
  Download,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ReportsWorkspaceData } from "../types/reports.types";

export function RecentReportsList() {
  const { data } = useQuery<ReportsWorkspaceData>({ queryKey: ["reports-workspace-data"] });
  const recentReports = data?.recentReports || [];

  // دالة لإعادة تنزيل أو فتح الملف المخزن
  const handleDownloadReport = (report: any) => {
    if (!report.blob) return;
    const url = URL.createObjectURL(report.blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", report.filename || `${report.title}.${report.format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[0_10px_32px_rgba(30,20,70,0.04)]">
      <header className="border-b border-border/45 px-5 py-4">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-foreground">
            Recent exports
          </h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Click any generated file to download it directly.
          </p>
        </div>
      </header>

      {recentReports.length > 0 ? (
        <div className="divide-y divide-border/40">
          {recentReports.map((report: any) => {
            const Icon = report.format === "PDF" ? FileText : report.format === "CSV" ? Table2 : FileJson;
            return (
              <div 
                key={report.id} 
                onClick={() => handleDownloadReport(report)}
                className="group flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors hover:bg-muted/30"
                title="Click to download"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-primary/10 text-primary transition-transform group-hover:scale-105">
                  <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-foreground group-hover:text-primary transition-colors">
                    {report.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="font-semibold text-primary">{report.format}</span> • {report.date}
                  </p>
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                  <Download size={15} />
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-[150px] flex-col items-center justify-center px-5 py-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-muted/50 text-muted-foreground">
            <FileBarChart2 aria-hidden="true" size={19} strokeWidth={1.7} />
          </span>
          <p className="mt-3 text-[12px] font-medium text-foreground">
            No export history available
          </p>
          <p className="mt-1 max-w-[260px] text-[10.5px] leading-5 text-muted-foreground">
            Files you generate will appear here for your session.
          </p>
        </div>
      )}
    </section>
  );
}
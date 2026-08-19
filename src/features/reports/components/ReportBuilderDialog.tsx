import { Check, ChevronDown, Download, FileJson, FileText, Table2, X, Loader2, Eye, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosClient } from "@/services/axios/axiosClient";
import { getAxiosErrorMessage } from "@/services/axios/axiosError";
import { toast } from "sonner";
import { Input } from "@/shared/ui/input";

import { useGenerateReport } from "../hooks/useReports";
import { useAcademicYears } from "../../settings/academic/hooks/useAcademicSettings.ts"; 
import type { ReportFormat, ReportTemplate } from "../types/reports.types";

const formatOptions: Array<{ value: ReportFormat; label: string; icon: typeof FileText }> = [
  { value: "PDF", label: "PDF document", icon: FileText },
  { value: "CSV", label: "CSV data file", icon: Table2 },
  { value: "JSON", label: "JSON raw data", icon: FileJson },
];

export function ReportBuilderDialog({ report, onClose }: { report: ReportTemplate | null; onClose: () => void; }) {
  const [format, setFormat] = useState<ReportFormat>("PDF");
  

  const [academicYearId, setAcademicYearId] = useState<string>(""); 
  const [dateRange, setDateRange] = useState("current_term");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const generateMutation = useGenerateReport();
  const { data: academicYearsList = [], isLoading: isAcademicLoading } = useAcademicYears();

  useEffect(() => {
    if (academicYearsList.length > 0 && !academicYearId) {
      const current = academicYearsList.find((y: any) => y.isCurrent) || academicYearsList[0];
      setAcademicYearId(String(current.id));
    }
  }, [academicYearsList]);

  useEffect(() => {
    if (!report) return;
    setFormat(report.formats[0] ?? "PDF");
    setDateRange("current_term");
    setStartDate("");
    setEndDate("");
    setPreviewData(null);
    generateMutation.reset();
  }, [report]);

  if (!report) return null;
  const Icon = report.icon;

  const isFormValid = dateRange !== "custom" || (startDate !== "" && endDate !== "");

  const handleGenerate = () => {
    generateMutation.mutate({ 
      template: report, 
      format, 
      academicYear: academicYearId, 
      dateRange,
      startDate: dateRange === "custom" ? startDate : undefined,
      endDate: dateRange === "custom" ? endDate : undefined
    });
  };

  const handlePreview = async () => {
    if (!report.endpoint) return;
    setIsPreviewLoading(true);
    setPreviewData(null);
    

    const params: any = { academic_year_id: academicYearId, date_range: dateRange };
    if (dateRange === "custom") {
      params.start_date = startDate;
      params.end_date = endDate;
    }

    try {
      const response = await axiosClient.get(report.endpoint, { params });
      const rawData = response.data?.data || response.data;
      
      let arrayData: any[] = [];
      if (Array.isArray(rawData)) {
        arrayData = rawData;
      } else if (rawData && typeof rawData === 'object') {
        if (rawData.missed_periods_by_subject && rawData.missed_periods_by_subject.length > 0) {
          arrayData = rawData.missed_periods_by_subject;
        } else if (rawData.classrooms_summary && rawData.classrooms_summary.length > 0) {
          arrayData = rawData.classrooms_summary;
        } else {
          const flatObj = { ...rawData };
          delete flatObj.classrooms_summary;
          delete flatObj.missed_periods_by_subject;
          arrayData = [flatObj];
        }
      }
      
      setPreviewData(arrayData.length > 0 ? arrayData : []);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error) || "Failed to load preview data.");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="max-h-[calc(100vh-32px)] w-full max-w-[720px] overflow-y-auto rounded-[26px] border border-border/60 bg-card text-card-foreground shadow-[0_28px_80px_rgba(0,0,0,0.22)]">
        
        <header className="flex items-start justify-between gap-4 border-b border-border/45 px-6 py-5 bg-muted/20">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary/10 text-primary border border-primary/20">
              <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                {report.category} report
              </p>
              <h2 className="mt-1 truncate text-[18px] font-semibold tracking-[-0.025em] text-foreground">
                {report.title}
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Configure parameters, preview data, and download.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-background border border-border/60 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <div className="space-y-6 p-6">
          <section>
            <h3 className="text-[12.5px] font-bold text-foreground">Export format</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {formatOptions.filter((o) => report.formats.includes(o.value)).map((option) => {
                const FormatIcon = option.icon;
                const isSelected = option.value === format;
                return (
                  <button
                    key={option.value} type="button" onClick={() => setFormat(option.value)}
                    className={["relative flex min-h-[88px] flex-col items-start rounded-[16px] border p-3.5 text-start transition-all",
                      isSelected ? "border-primary/40 bg-primary/10 text-primary shadow-sm" : "border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5",
                    ].join(" ")}
                  >
                    <FormatIcon aria-hidden="true" size={18} strokeWidth={1.8} />
                    <span className={`mt-3 text-[12px] font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{option.value}</span>
                    <span className="mt-1 text-[10px] font-medium opacity-75">{option.label}</span>
                    {isSelected && (
                      <span className="absolute end-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check aria-hidden="true" size={12} strokeWidth={2.2} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11.5px] font-bold text-foreground">Academic year</span>
              <span className="relative mt-2 block">
                <select 
                  value={academicYearId} 
                  onChange={(e) => setAcademicYearId(e.target.value)}
                  disabled={isAcademicLoading}
                  className="h-11 w-full appearance-none rounded-[14px] border border-border/65 bg-background/60 px-4 pe-10 text-[12.5px] font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                >
                  {isAcademicLoading ? (
                    <option value="">Loading years...</option>
                  ) : academicYearsList.length > 0 ? (
                    academicYearsList.map((yr: any) => (
                      <option key={yr.id} value={String(yr.id)}>{yr.name}</option>
                    ))
                  ) : (
                    <option value="">No Years</option>
                  )}
                </select>
                <ChevronDown aria-hidden="true" size={15} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </span>
            </label>

            <label className="block">
              <span className="text-[11.5px] font-bold text-foreground">Reporting period</span>
              <span className="relative mt-2 block">
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
                  className="h-11 w-full appearance-none rounded-[14px] border border-border/65 bg-background/60 px-4 pe-10 text-[12.5px] font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                >
                  <option value="current_term">Current term</option>
                  <option value="current_month">Current month</option>
                  <option value="academic_year">Academic year</option>
                  <option value="custom">Custom range</option>
                </select>
                <ChevronDown aria-hidden="true" size={15} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </span>
            </label>

            {dateRange === "custom" && (
              <div className="col-span-1 sm:col-span-2 grid gap-4 sm:grid-cols-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block space-y-2">
                  <span className="text-[11.5px] font-bold text-foreground">Start Date</span>
                  <div className="relative">
                    <CalendarDays className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input 
                      type="date" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)}
                      className="h-11 rounded-[14px] border-border/65 bg-background/60 ps-10 text-[12.5px]"
                    />
                  </div>
                </label>
                <label className="block space-y-2">
                  <span className="text-[11.5px] font-bold text-foreground">End Date</span>
                  <Input 
                    type="date" 
                    value={endDate} 
                    min={startDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="h-11 rounded-[14px] border-border/65 bg-background/60 text-[12.5px]"
                  />
                </label>
              </div>
            )}
          </section>

          {previewData !== null && (
            <section className="animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-[12.5px] font-bold text-foreground mb-3">Live Data Preview</h3>
              <div className="max-h-[220px] overflow-auto rounded-[16px] border border-border/60 bg-card shadow-sm">
                {previewData.length > 0 ? (
                  <table className="w-full text-start text-[11px]">
                    <thead className="sticky top-0 bg-muted/90 backdrop-blur-md z-10">
                      <tr className="border-b border-border/60">
                        {Object.keys(previewData[0]).slice(0, 5).map(key => (
                          <th key={key} className="px-4 py-2.5 text-start font-bold text-muted-foreground uppercase tracking-wider">
                            {key.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {previewData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition-colors">
                          {Object.values(row).slice(0, 5).map((val: any, vIdx) => (
                            <td key={vIdx} className="px-4 py-2.5 text-foreground font-medium truncate max-w-[140px]">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-[12px] font-medium">
                    No data found for the selected parameters.
                  </div>
                )}
              </div>
              {previewData.length > 10 && (
                <p className="mt-2.5 text-[10.5px] font-semibold text-primary text-center bg-primary/10 py-1.5 rounded-[8px]">
                  Showing top 10 rows. Export to view all {previewData.length} records.
                </p>
              )}
            </section>
          )}

          {generateMutation.isSuccess && (
            <div className="flex items-center gap-3 rounded-[16px] border border-success/30 bg-success/10 p-4 text-success">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <Check aria-hidden="true" size={16} strokeWidth={2} />
              </span>
              <p className="text-[12px] font-bold">{generateMutation.data?.message || "Report generated successfully."}</p>
            </div>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-border/45 px-6 py-5 bg-muted/20 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-[12px] border border-border/80 px-5 text-[12.5px] font-bold text-muted-foreground transition hover:bg-background hover:text-foreground shadow-2xs bg-card"
          >
            Cancel
          </button>
          
          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={isPreviewLoading || !isFormValid}
              onClick={handlePreview}
              className="inline-flex h-10 flex-1 sm:flex-none items-center justify-center gap-2 rounded-[12px] bg-primary/10 border border-primary/25 px-5 text-[12px] font-bold text-primary transition hover:bg-primary/20 disabled:opacity-50"
            >
              {isPreviewLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye size={15} />}
              Preview Data
            </button>

            <button
              type="button"
              disabled={generateMutation.isPending || !isFormValid}
              onClick={handleGenerate}
              className="inline-flex h-10 flex-1 sm:flex-none items-center justify-center gap-2 rounded-[12px] bg-primary px-6 text-[12px] font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generateMutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
              ) : (
                <><Download aria-hidden="true" size={15} strokeWidth={1.9} /> Generate {format}</>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
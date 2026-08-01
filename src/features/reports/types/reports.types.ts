import type { LucideIcon } from "lucide-react";

export type ReportStatus = "Ready" | "Processing" | "Scheduled";
export type ReportFormat = "PDF" | "Excel" | "CSV";
export type ReportTone = "primary" | "info" | "success" | "warning" | "destructive" | "secondary";

export type ReportCategory =
  | "Students"
  | "Academics"
  | "Attendance"
  | "Staff"
  | "Finance"
  | "Communications";

export type ReportMetric = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone: ReportTone;
  change?: string;
};

export type ReportTemplate = {
  id: string;
  category: ReportCategory;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: ReportTone;
  formats: ReportFormat[];
  filters: string[];
  featured?: boolean;
};

export type RecentReport = {
  id: string;
  title: string;
  category: ReportCategory;
  status: ReportStatus;
  date: string;
  format: ReportFormat;
  size?: string;
};

export type ReportsResponse = {
  metrics: ReportMetric[];
  templates: ReportTemplate[];
  recentReports: RecentReport[];
};

export type ReportBuilderSelection = {
  template: ReportTemplate;
  format: ReportFormat;
  academicYear: string;
  dateRange: string;
};

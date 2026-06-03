import type { LucideIcon } from "lucide-react";

export type ReportStatus = "Ready" | "Processing" | "Scheduled";

export type ReportType =
  | "Attendance"
  | "Academic"
  | "Communications"
  | "Finance";

export type ReportMetric = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

export type ReportCardInfo = {
  title: string;
  description: string;
  icon: LucideIcon;
  action: string;
};

export type RecentReport = {
  title: string;
  type: ReportType;
  status: ReportStatus;
  date: string;
};

export interface ReportsResponse {
  metrics: ReportMetric[];
  reportCards: ReportCardInfo[];
  recentReports: RecentReport[];
}

import {
  BarChart3,
  CalendarCheck,
  CalendarDays,
  FileText,
  ListChecks,
  PieChart,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ReportsResponse } from "../types/reports.types";

export const reportsMock: ReportsResponse = {
  metrics: [
    {
      title: "Total Reports",
      value: "24",
      description: "Available system reports",
      icon: BarChart3,
      color: "text-primary bg-primary/10",
    },
    {
      title: "Generated This Month",
      value: "9",
      description: "New reports created this month",
      icon: TrendingUp,
      color: "text-success bg-success/10",
    },
    {
      title: "Pending Exports",
      value: "3",
      description: "Waiting to download",
      icon: FileText,
      color: "text-warning bg-warning/10",
    },
    {
      title: "Scheduled Reports",
      value: "6",
      description: "Automated deliveries active",
      icon: CalendarDays,
      color: "text-info bg-info/10",
    },
  ],
  reportCards: [
    {
      title: "Attendance Summary",
      description: "Track student attendance trends and monthly summaries.",
      icon: CalendarCheck,
      action: "Generate",
    },
    {
      title: "Grade Breakdown",
      description: "View performance by class, subject, and grade level.",
      icon: PieChart,
      action: "View details",
    },
    {
      title: "Behavior Logs",
      description: "Analyze student behavior reports and interventions.",
      icon: ListChecks,
      action: "Download",
    },
    {
      title: "Staff Activity",
      description: "Review staff attendance and engagement over time.",
      icon: Users,
      action: "Generate",
    },
  ],
  recentReports: [
    {
      title: "March Attendance Overview",
      type: "Attendance",
      status: "Ready",
      date: "Mar 28, 2026",
    },
    {
      title: "Quarter 1 Grade Analysis",
      type: "Academic",
      status: "Processing",
      date: "Mar 30, 2026",
    },
    {
      title: "Parent Communication Log",
      type: "Communications",
      status: "Ready",
      date: "Apr 2, 2026",
    },
    {
      title: "Payroll & Tuition Report",
      type: "Finance",
      status: "Scheduled",
      date: "Apr 5, 2026",
    },
  ],
};

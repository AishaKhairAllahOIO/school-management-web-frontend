import {
  BarChart3,
  CalendarCheck,
  CalendarDays,
  FileText,
  ListChecks,
  PieChart,
  TrendingUp,
  Users,
  Wallet,
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
      title: "Financial Reports",
      description: "Review fee collection, balances, and tuition payment history.",
      icon:  Wallet,
      action: "Export PDF",
    },
    {
      title: "Attendance Reports",
      description: "Monitor student and staff attendance patterns.",
      icon: CalendarCheck,
      action: "Generate",
    },
    {
      title: "Salary Reports",
      description: "Analyze payroll by teachers, supervisors, and service staff.",
      icon: ListChecks,
      action: "View details",
    },
    {
      title: "Academic Reports",
      description: "Track grades, top students, and class performance.",
      icon: PieChart,
      action: "Generate",
    },
    {
      title: "Behavioral Reports",
      description: "Review evaluations, warnings, and disciplinary cases.",
      icon: Users,
      action: "Download",
    },
    {
      title: "Analytics Center",
      description: "See the most critical KPIs across finance, attendance, and student behavior.",
      icon: BarChart3,
      action: "Open dashboard",
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

import type {
  AttendancePoint,
  ChartPoint,
  DashboardInsight,
  DashboardMetric,
  DashboardStat,
  FeeCollection,
  GradeDistributionItem,
  RecentActivity,
  StudentsByGradeItem,
  UpcomingEvent,
} from "@/features/dashboard/types/dashboard.types";

export const dashboardStats: DashboardStat[] = [
  {
    id: "students",
    label: "Total Students",
    value: "1,248",
    growth: "+4.8%",
    icon: "students",
  },
  {
    id: "teachers",
    label: "Total Teachers",
    value: "86",
    growth: "+2.3%",
    icon: "teachers",
  },
  {
    id: "classes",
    label: "Active Classes",
    value: "42",
    growth: "+1.6%",
    icon: "classes",
  },
  {
    id: "revenue",
    label: "Collected Fees",
    value: "$48,750",
    growth: "+8.7%",
    icon: "revenue",
  },
];

export const attendanceOverview: AttendancePoint[] = [
  { day: "Sun", rate: 92 },
  { day: "Mon", rate: 95 },
  { day: "Tue", rate: 91 },
  { day: "Wed", rate: 94 },
  { day: "Thu", rate: 93 },
  { day: "Fri", rate: 89 },
  { day: "Sat", rate: 90 },
];

export const recentActivities: RecentActivity[] = [
  {
    id: "activity-1",
    type: "student",
    title: "New student registered",
    description: "Sara Ahmed joined Seventh Grade",
    time: "12 min ago",
  },
  {
    id: "activity-2",
    type: "payment",
    title: "Fee payment received",
    description: "Annual fee payment completed",
    time: "35 min ago",
  },
  {
    id: "activity-3",
    type: "schedule",
    title: "Class schedule updated",
    description: "Eighth Grade timetable updated",
    time: "1 hour ago",
  },
  {
    id: "activity-4",
    type: "teacher",
    title: "Teacher assigned",
    description: "Physics teacher assigned to Ninth Grade",
    time: "2 hours ago",
  },
];

export const studentsByGrade: StudentsByGradeItem[] = [
  {
    grade: "Seventh",
    total: 438,
    percentage: 35.1,
  },
  {
    grade: "Eighth",
    total: 405,
    percentage: 32.5,
  },
  {
    grade: "Ninth",
    total: 405,
    percentage: 32.5,
  },
];

export const feeCollection: FeeCollection = {
  totalCollected: 48750,
  totalFees: 65000,
  collectionRate: 75,
};

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "event-1",
    month: "MAY",
    day: "28",
    title: "Parent-Teacher Meeting",
    dateTime: "May 28 • 10:00 AM",
  },
  {
    id: "event-2",
    month: "MAY",
    day: "30",
    title: "Monthly Examination",
    dateTime: "May 30 • 09:00 AM",
  },
  {
    id: "event-3",
    month: "JUN",
    day: "05",
    title: "Sports Day",
    dateTime: "June 5 • 08:00 AM",
  },
];

export const dashboardInsight: DashboardInsight = {
  title: "School Performance Overview",
  description:
    "Attendance remains above 90% and fee collection reached 75% of the annual target.",
  actionLabel: "View Reports",
};

export const secretaryMetrics: DashboardMetric[] = [
  {
    id: "secretary-1",
    label: "Pending Requests",
    value: "18",
    change: "+6%",
    icon: "documents",
  },
  {
    id: "secretary-2",
    label: "Calls Scheduled",
    value: "42",
    change: "+12%",
    icon: "calls",
  },
  {
    id: "secretary-3",
    label: "Fees Reviewed",
    value: "57",
    change: "+9%",
    icon: "wallet",
  },
  {
    id: "secretary-4",
    label: "Active Cases",
    value: "8",
    change: "-2%",
    icon: "cases",
  },
];

export const supervisorMetrics: DashboardMetric[] = [
  {
    id: "supervisor-1",
    label: "Students Flagged",
    value: "24",
    change: "+5%",
    icon: "students",
  },
  {
    id: "supervisor-2",
    label: "Open Cases",
    value: "12",
    change: "+3%",
    icon: "warnings",
  },
  {
    id: "supervisor-3",
    label: "Reports Submitted",
    value: "31",
    change: "+10%",
    icon: "documents",
  },
  {
    id: "supervisor-4",
    label: "Meetings Planned",
    value: "7",
    change: "0%",
    icon: "meetings",
  },
];

export const superAdminMetrics: DashboardMetric[] = [
  {
    id: "superadmin-1",
    label: "Total Revenue",
    value: "$48.7K",
    change: "+8.7%",
    icon: "revenue",
  },
  {
    id: "superadmin-2",
    label: "Attendance Rate",
    value: "93%",
    change: "+1.2%",
    icon: "attendance",
  },
  {
    id: "superadmin-3",
    label: "Active Classes",
    value: "42",
    change: "+1.6%",
    icon: "classes",
  },
  {
    id: "superadmin-4",
    label: "Teacher Performance",
    value: "A+",
    change: "+3%",
    icon: "teachers",
  },
];

export const attendanceChart: ChartPoint[] = [
  { label: "Mon", value: 92 },
  { label: "Tue", value: 95 },
  { label: "Wed", value: 94 },
  { label: "Thu", value: 93 },
  { label: "Fri", value: 90 },
];

export const gradeDistribution: GradeDistributionItem[] = [
  { label: "Seventh Grade", value: 438 },
  { label: "Eighth Grade", value: 405 },
  { label: "Ninth Grade", value: 405 },
];

export const secretaryActivities: RecentActivity[] = [
  {
    id: "secretary-activity-1",
    type: "schedule",
    title: "Registration forms reviewed",
    description: "New student registration requests were processed.",
    time: "10 min ago",
  },
  {
    id: "secretary-activity-2",
    type: "payment",
    title: "Fee receipts verified",
    description: "Confirmed fee payments for three students.",
    time: "45 min ago",
  },
];

export const supervisorActivities: RecentActivity[] = [
  {
    id: "supervisor-activity-1",
    type: "teacher",
    title: "Follow-up meeting scheduled",
    description: "Met with students at academic risk.",
    time: "1 hour ago",
  },
  {
    id: "supervisor-activity-2",
    type: "student",
    title: "Attendance review completed",
    description: "Reviewed absence records for grade 9.",
    time: "2 hours ago",
  },
];
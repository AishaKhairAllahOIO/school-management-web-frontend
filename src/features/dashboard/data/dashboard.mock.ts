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
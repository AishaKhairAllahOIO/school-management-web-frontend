import type {
  AttendancePoint,
  DashboardInsight,
  DashboardStat,
  FeeCollection,
  RecentActivity,
  StudentsByGradeItem,
  UpcomingEvent,
} from "@/features/dashboard/types/dashboard.types";

export const dashboardStats: DashboardStat[] = [
  {
    id: "students",
    label: "Total Students",
    value: "1,248",
    growth: "+12.5%",
    icon: "students",
  },
  {
    id: "teachers",
    label: "Total Teachers",
    value: "86",
    growth: "+8.4%",
    icon: "teachers",
  },
  {
    id: "classes",
    label: "Total Classes",
    value: "64",
    growth: "+15.3%",
    icon: "classes",
  },
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$48,750",
    growth: "+18.6%",
    icon: "revenue",
  },
];

export const attendanceOverview: AttendancePoint[] = [
  { day: "Sun", rate: 52 },
  { day: "Mon", rate: 78 },
  { day: "Tue", rate: 61 },
  { day: "Wed", rate: 84 },
  { day: "Thu", rate: 72 },
  { day: "Fri", rate: 88 },
  { day: "Sat", rate: 67 },
];

export const recentActivities: RecentActivity[] = [
  {
    id: "activity-1",
    type: "student",
    title: "New student registration",
    description: "Emma Johnson has been registered",
    time: "10 min ago",
  },
  {
    id: "activity-2",
    type: "payment",
    title: "Fee payment received",
    description: "Payment of $1,250 received from John Doe",
    time: "35 min ago",
  },
  {
    id: "activity-3",
    type: "schedule",
    title: "Class scheduled",
    description: "Mathematics - Grade 10A scheduled",
    time: "2 hours ago",
  },
  {
    id: "activity-4",
    type: "teacher",
    title: "Teacher assigned",
    description: "Mr. Smith assigned to Physics - Grade 11",
    time: "3 hours ago",
  },
];

export const studentsByGrade: StudentsByGradeItem[] = [
  {
    grade: "Grade 9",
    total: 320,
    percentage: 25.6,
  },
  {
    grade: "Grade 10",
    total: 298,
    percentage: 23.9,
  },
  {
    grade: "Grade 11",
    total: 315,
    percentage: 25.2,
  },
  {
    grade: "Grade 12",
    total: 315,
    percentage: 25.2,
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
    dateTime: "May 28, 2025 • 10:00 AM",
  },
  {
    id: "event-2",
    month: "MAY",
    day: "30",
    title: "Monthly Examination",
    dateTime: "May 30, 2025 • 09:00 AM",
  },
  {
    id: "event-3",
    month: "JUN",
    day: "05",
    title: "Sports Day",
    dateTime: "June 5, 2025 • 08:00 AM",
  },
];

export const dashboardInsight: DashboardInsight = {
  title: "Your school is performing great!",
  description: "Attendance is up 12% this month. Keep up the excellent work.",
  actionLabel: "View Report",
};
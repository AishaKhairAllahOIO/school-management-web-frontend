export type DashboardStat = {
  id: "students" | "teachers" | "classes" | "revenue";
  label: string;
  value: string;
  growth: string;
  icon: "students" | "teachers" | "classes" | "revenue";
};

export type AttendancePoint = {
  day: string;
  rate: number;
};

export type RecentActivity = {
  id: string;
  type: "student" | "payment" | "schedule" | "teacher";
  title: string;
  description: string;
  time: string;
};

export type StudentsByGradeItem = {
  grade: string;
  total: number;
  percentage: number;
};

export type FeeCollection = {
  totalCollected: number;
  totalFees: number;
  collectionRate: number;
};

export type UpcomingEvent = {
  id: string;
  month: string;
  day: string;
  title: string;
  dateTime: string;
};

export type DashboardInsight = {
  title: string;
  description: string;
  actionLabel: string;
};
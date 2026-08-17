export interface DashboardOverview {
  students_count: number;
  teachers_count: number;
  staff_count: number;
  classes_count: number;
}

export interface FinanceSummary {
  total_due: number;
  total_paid: number;
  total_remaining: number;
}

export interface AttendanceSummary {
  present: number;
  excused_absence: number;
  unexcused_absence: number;
}

export interface StageStudents {
  stage_id: number;
  stage_name: string;
  students_count: number;
}

export interface StaffType {
  type: string;
  label: string;
  count: number;
}

export interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  created_at: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
}

export interface NotificationsData {
  unread_count: number;
  items: Notification[];
}

export interface SuperAdminDashboardData {
  overview: DashboardOverview;
  finance: FinanceSummary;
  attendance: AttendanceSummary;
  students_by_stage: StageStudents[];
  staff_by_type: StaffType[];
  activities: Activity[];
  notifications: NotificationsData;
}

// Adviser Dashboard
export interface AdviserOverview {
  students_count: number;
  classes_count: number;
  students_with_absence: number;
  students_with_unexcused_absence: number;
}

export interface ClassData {
  class_id: number;
  class_name: string;
  students_count: number;
}

export interface AdviserDashboardData {
  overview: AdviserOverview;
  attendance: AttendanceSummary;
  students_by_stage: StageStudents[];
  classes: ClassData[];
  activities: Activity[];
  notifications: NotificationsData;
}

export interface SecretaryDashboardData {
  overview: DashboardOverview;
  attendance: AttendanceSummary;
  finance: FinanceSummary;
  students_by_stage: StageStudents[];
  activities: Activity[];
  notifications: NotificationsData;
}

export interface DashboardResponse {
  role: "super_admin" | "secretary" | "adviser";
  dashboard_data: SuperAdminDashboardData | SecretaryDashboardData | AdviserDashboardData;
}
import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                  Category                                  */
/* -------------------------------------------------------------------------- */

export type ReportCategory =
  | "Attendance"
  | "Staff"
  | "Finance"
  | "Academics";

/* -------------------------------------------------------------------------- */
/*                                    Tone                                    */
/* -------------------------------------------------------------------------- */

export type ReportTone =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "destructive"
  | "secondary";

/* -------------------------------------------------------------------------- */
/*                                   Format                                   */
/* -------------------------------------------------------------------------- */

export type ReportFormat =
  | "JSON"
  | "CSV"
  | "PDF";

/* -------------------------------------------------------------------------- */
/*                                   Status                                   */
/* -------------------------------------------------------------------------- */

export type ReportStatus =
  | "Ready"
  | "Error";

/* -------------------------------------------------------------------------- */
/*                                  Metrics                                   */
/* -------------------------------------------------------------------------- */

export type ReportMetric = {
  title: string;
  value: string | number;
  change?: string;
  tone: ReportTone;
  icon: LucideIcon;

  /**
   * Used to decide which metric is visible
   * when a category is selected.
   */
  category?: ReportCategory;
};

/* -------------------------------------------------------------------------- */
/*                              Report Template                               */
/* -------------------------------------------------------------------------- */

export type ReportTemplateId =
  | "student-attendance-summary"
  | "staff-attendance-report"
  | "student-finance-revenue"
  | "staff-payroll-summary";

export type ReportTemplate = {
  id: ReportTemplateId;
  title: string;
  description: string;
  category: ReportCategory;
  formats: ReportFormat[];
  tone: ReportTone;
  icon: LucideIcon;
  featured?: boolean;
  endpoint: string;
};

/* -------------------------------------------------------------------------- */
/*                         Student Attendance Report                           */
/* -------------------------------------------------------------------------- */

export type StudentAttendanceClassroomSummary = {
  class_room_id: number;
  class_room_name: string;
  student_count: number;
  attendance_rate: number;
  absence_rate: number;
  unexcused_absences: number;
  excused_absences: number;
};

export type StudentAttendanceReportResponse = {
  total_students: number;
  overall_attendance_rate: number;
  overall_absence_rate: number;
  total_unexcused_absences: number;
  total_excused_absences: number;
  classrooms_summary: StudentAttendanceClassroomSummary[];
};

/* -------------------------------------------------------------------------- */
/*                           Staff Attendance Report                           */
/* -------------------------------------------------------------------------- */

export type StaffAttendanceSubjectSummary = {
  subject_name: string;
  missed_periods_count: number;
};

export type StaffAttendanceReportResponse = {
  total_staff: number;
  overall_attendance_rate: number;
  overall_absence_rate: number;
  total_unexcused_days: number;
  total_excused_days: number;
  total_leave_days: number;
  total_missed_periods_count: number;
  missed_periods_by_subject: StaffAttendanceSubjectSummary[];
};

/* -------------------------------------------------------------------------- */
/*                            Student Finance Report                           */
/* -------------------------------------------------------------------------- */

export type StudentFinanceReportResponse = {
  total_expected_revenue: number;
  total_collected_revenue: number;
  total_outstanding_amount: number;
  overall_collection_rate: number;
  total_payments_count: number;
};

/* -------------------------------------------------------------------------- */
/*                             Staff Finance Report                            */
/* -------------------------------------------------------------------------- */

export type StaffFinanceReportResponse = {
  total_payrolls_processed: number;
  total_net_salaries_paid: number;
  average_salary_paid: number;
};

/* -------------------------------------------------------------------------- */
/*                            Reports Workspace                               */
/* -------------------------------------------------------------------------- */

export type ReportsWorkspaceData = {
  metrics: ReportMetric[];

  templates: ReportTemplate[];

  studentAttendance: StudentAttendanceReportResponse | null;

  staffAttendance: StaffAttendanceReportResponse | null;

  studentFinance: StudentFinanceReportResponse | null;

  staffFinance: StaffFinanceReportResponse | null;

  recentReports?: any[];
};

/* -------------------------------------------------------------------------- */
/*                             Generated Report                               */
/* -------------------------------------------------------------------------- */

export type GeneratedReport = {
  id: string;
  title: string;
  format: ReportFormat;
  createdAt: string;
  status: ReportStatus;
  blob: Blob;
  filename: string;
};


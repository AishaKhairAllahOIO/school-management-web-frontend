export type AttendanceStatus = "present" | "absent";

export type AbsenceType = "excused" | "unexcused" | null;

export interface AttendanceRecord {
  id: number;
  status: AttendanceStatus;
  absence_type: AbsenceType;
  notes?: string | null;
  attendance_date: string;
}

export interface AttendanceSummary {
  allowed_absence_days: number;
  total_unexcused_absent: number;
  remaining_absence_days: number;
}

export interface StudentAttendance {
  enrollment_id: number;
  student_id: number;
  full_name: string;
  photo_url: string | null;

  allowed_absence_days: number;
  total_unexcused_absent: number;
  remaining_absence_days: number;

  attendance: AttendanceRecord | null;
}

export interface AttendanceFilterParams {
  search_name?: string;
  grade_id?: number;
  class_room_id?: number;
  attendance_date?: string;
  status?: AttendanceStatus;
  absence_type?: Exclude<AbsenceType, null>;
  semester_id?: number;
  page?: number;
  per_page?: number;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  total: number;
  per_page: number;
  last_page?: number;
  from?: number | null;
  to?: number | null;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: PaginatedData<T>;
}

export interface UpdateAttendancePayload {
  status: AttendanceStatus;
  absence_type: AbsenceType;
  attendance_date: string;
}

export interface BulkAttendanceItem {
  enrollment_id: number;
  status: AttendanceStatus;
  absence_type: AbsenceType;
}

export interface BulkAttendancePayload {
  semester_id: number;
  class_room_id: number;
  attendance_date: string;
  attendances: BulkAttendanceItem[];
}

export interface AttendanceSummaryResponse {
  attendance_record: AttendanceRecord;
  attendance_summary: AttendanceSummary;
}
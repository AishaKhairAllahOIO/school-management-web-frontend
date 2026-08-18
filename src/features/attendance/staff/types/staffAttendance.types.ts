export type StaffAttendanceStatus = "present" | "absent" | "partial_absence";
export type AbsenceType = "excused" | "unexcused";

export type MissingPeriod = {
  schedule_entry_id: number;
  period_index: number;
  day: string;
  room_class: string;
  grade_subject_id: number;
};

export type StaffAttendanceRecord = {
  id: number;
  staff_id: number;
  attendance_date: string;
  status: StaffAttendanceStatus;
  absence_type: AbsenceType | null;
  missing_periods?: MissingPeriod[];
  created_at?: string;
  updated_at?: string;
};

export type CreateStaffAttendancePayload = {
  staff_id: number;
  attendance_date: string; // Y-m-d
  status: StaffAttendanceStatus;
  absence_type?: AbsenceType | null;
  missing_periods?: number[];
};

export type UpdateStaffAttendancePayload = {
  status: StaffAttendanceStatus;
  absence_type?: AbsenceType | null;
  missing_periods?: number[];
};

export interface StaffDailyRosterRecord {
  id: number;
  user_id: number;
  degree?: string;
  role?: string | string[]; 
  attendance: {
    id: number | null; 
    status: StaffAttendanceStatus;
    absence_type: AbsenceType | null;
    attendance_date: string;
    staff_leave_id?: number | null;
    missing_periods?: number[];
  };
  user: {
    id: number;
    first_name: string;
    last_name: string;
    role?: string | string[]; 
    roles?: { name: string }[]; 
  };
}
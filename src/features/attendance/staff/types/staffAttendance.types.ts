export type StaffAttendanceStatus = 'present' | 'absent' | 'partial_absence';
export type StaffAbsenceType = 'excused' | 'unexcused';

export interface MissingPeriod {
  schedule_entry_id: number;
  period_index: number;
  day: string;
  class_room: string;
  grade_subject_id: number;
}

export interface StaffAttendanceRecord {
  id: number;
  staff_id: number;
  attendance_date: string;
  status: StaffAttendanceStatus;
  absence_type?: StaffAbsenceType | null;
  missing_periods?: MissingPeriod[];
}

export interface CreateStaffAttendancePayload {
  staff_id: number;
  attendance_date: string;
  status: StaffAttendanceStatus;
  absence_type?: StaffAbsenceType | null;
  missing_periods?: number[]; 
}

export interface StaffLeave {
  id: number;
  staff_id: number;
  leave_type: {
    id: number;
    name: string;
    payment_type: string;
  };
  academic_year_id: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface CreateStaffLeavePayload {
  staff_id: number;
  leave_type_id: number;
  academic_year_id: number;
  start_date: string;
  end_date: string;
}
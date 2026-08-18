export type LeaveType = {
  id: number;
  name: string;
  payment_type: "paid" | "unpaid";
  max_days_per_academic_year?: number;
};

export type StaffLeaveRecord = {
  id: number;
  staff_id: number;
  leave_type_id?: number;
  leave_type: LeaveType;
  academic_year_id: number;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateStaffLeavePayload = {
  staff_id: number;
  leave_type_id: number;
  academic_year_id: number;
  start_date: string; // Y-m-d
  end_date: string;   // Y-m-d[cite: 1]
};

export type UpdateStaffLeavePayload = Partial<CreateStaffLeavePayload>;
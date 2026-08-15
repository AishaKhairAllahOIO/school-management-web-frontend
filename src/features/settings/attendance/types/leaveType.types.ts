export type PaymentType = "paid" | "unpaid";

export interface LeaveType {
  id: number;
  name: string;
  payment_type: PaymentType;
  max_days_per_academic_year: number;
  created_at?: string;
}

export interface CreateLeaveTypePayload {
  name: string;
  payment_type: PaymentType;
  max_days_per_academic_year: number;
}

export interface UpdateLeaveTypePayload {
  id: string | number;
  payload: Partial<CreateLeaveTypePayload>;
}
export type TeacherWorkload = {
  id: string;
  academicYearId: string;
  teacherId: string;
  requiredMonthlyPeriods: number;
  assignedMonthlyPeriods: number;
  remainingMonthlyPeriods: number;
  createdAt: string;
  updatedAt: string;
};

export type TeacherWorkloadApiItem = {
  id: string | number;
  academicYearId?: string | number;
  academic_year_id?: string | number;
  teacherId?: string | number;
  teacher_id?: string | number;
  requiredMonthlyPeriods?: number | string;
  required_monthly_periods?: number | string;
  assignedMonthlyPeriods?: number | string;
  assigned_monthly_periods?: number | string;
  remainingMonthlyPeriods?: number | string;
  remaining_monthly_periods?: number | string;
  createdAt?: string | null;
  created_at?: string | null;
  updatedAt?: string | null;
  updated_at?: string | null;
};

export type CreateTeacherWorkloadPayload = {
  academicYearId: string;
  teacherId: string;
  requiredMonthlyPeriods: number;
};

export type UpdateTeacherWorkloadPayload =
  Partial<CreateTeacherWorkloadPayload>;

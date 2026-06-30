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

export type CreateTeacherWorkloadPayload = {
  academicYearId: string;
  teacherId: string;
  requiredMonthlyPeriods: number;
};

export type UpdateTeacherWorkloadPayload = Partial<CreateTeacherWorkloadPayload>;

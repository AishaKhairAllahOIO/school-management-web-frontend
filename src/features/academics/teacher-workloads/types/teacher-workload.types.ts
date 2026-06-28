
export type TeacherWorkload = {
  id: string;

  academicYearId: string;

  teacherId: string;

  requiredMonthlyPeriods: number;

  assignedMonthlyPeriods: number;//back calculate
  remainingMonthlyPeriods: number;//back calculate  requiredMonthlyPeriods-remainingMonthlyPeriods

  createdAt: string;
  updatedAt: string;
};

export type CreateTeacherWorkloadPayload = {
  academicYearId: string;

  teacherId: string;

  requiredMonthlyPeriods: number;

};

export type UpdateTeacherWorkloadPayload =
  Partial<CreateTeacherWorkloadPayload>;

export type StudentAttendanceSetting = {
  id: string;
  semesterId: string;
  workingDays: number;
  requiredAttendancePercentage: number;
  allowedAbsenceDays: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateStudentAttendanceSettingPayload = {
  semesterId: string;
  workingDays: number;
  requiredAttendancePercentage: number;
};

export type UpdateStudentAttendanceSettingPayload =
  Partial<CreateStudentAttendanceSettingPayload>;

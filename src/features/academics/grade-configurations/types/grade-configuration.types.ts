export type GradeConfiguration = {
  id: string;
  academicYearId: string;
  gradeId: string;
  supervisorId: string;
  plannedClassroomsCount: number;
  plannedStudentsCapacity: number;
  actualClassroomsCount: number;
  actualStudentsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateGradeConfigurationPayload = {
  academicYearId: string;
  gradeId: string;
  supervisorId: string;
  plannedClassroomsCount: number;
};

export type UpdateGradeConfigurationPayload = Partial<CreateGradeConfigurationPayload>;

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
  academicYearId: number;
  gradeId: number;
  supervisorId: number;
  plannedClassroomsCount: number;
};

export type UpdateGradeConfigurationPayload = {
  supervisorId?: number;
  plannedClassroomsCount?: number;
};

export type CreateGradeConfigurationApiPayload = {
  academicYearId: number;
  grade_level_id: number;
  supervisor_id: number;
  planned_classrooms_count: number;
};

export type UpdateGradeConfigurationApiPayload = {
  supervisor_id?: number;
  planned_classrooms_count?: number;
};
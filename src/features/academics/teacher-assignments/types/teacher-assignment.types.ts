export type TeacherAssignment = {
  id: string;

  teacherId: string;
  classroomId: string;
  subjectId: string;

  academicYearId: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};

export type CreateTeacherAssignmentPayload = {
  teacherId: string;
  classroomId: string;
  subjectId: string;
  academicYearId: string;
  isActive: boolean;
};

export type UpdateTeacherAssignmentPayload =
  Partial<CreateTeacherAssignmentPayload>;
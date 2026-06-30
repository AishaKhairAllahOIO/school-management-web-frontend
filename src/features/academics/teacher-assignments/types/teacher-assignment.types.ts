export type TeacherAssignment = {
  id: string;
  academicYearId: string;
  academicTermId: string;
  teacherId: string;
  gradeSubjectId: string;
  classroomIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateTeacherAssignmentPayload = {
  academicYearId: string;
  academicTermId: string;
  teacherId: string;
  gradeSubjectId: string;
  classroomIds: string[];
};

export type UpdateTeacherAssignmentPayload = Partial<CreateTeacherAssignmentPayload>;

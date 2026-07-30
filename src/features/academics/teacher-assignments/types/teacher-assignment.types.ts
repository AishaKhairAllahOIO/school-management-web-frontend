export type TeacherAssignment = {
  id: string;
  academicYearId: string;
  academicTermId: string;
  teacherId: string;
  gradeSubjectId: string;
  classroomId: string;
  createdAt: string;
  updatedAt: string;
};

export type TeacherAssignmentApiItem = {
  id: string | number;
  academicYearId?: string | number;
  academic_year_id?: string | number;
  academicTermId?: string | number;
  semesterId?: string | number;
  semester_id?: string | number;
  teacherId?: string | number;
  teacher_id?: string | number;
  gradeSubjectId?: string | number;
  grade_subject_id?: string | number;
  classroomId?: string | number;
  classRoomId?: string | number;
  class_room_id?: string | number;
  createdAt?: string | null;
  created_at?: string | null;
  updatedAt?: string | null;
  updated_at?: string | null;
};

export type CreateTeacherAssignmentPayload = {
  academicYearId: string;
  academicTermId: string;
  teacherId: string;
  gradeSubjectId: string;
  classroomIds: string[];
};

export type UpdateTeacherAssignmentPayload = {
  academicYearId?: string;
  academicTermId?: string;
  teacherId?: string;
  gradeSubjectId?: string;
  classroomId?: string;
};

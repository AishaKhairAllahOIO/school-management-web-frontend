export type EnrollmentStatus =
  | "suspended"
  | "enrolled"
  | "completed"
 

export type StudentEnrollment = {
  id: string;
  studentId: string;
  academicYearId: string;
  gradeId: string;
  classroomId: string;
  enrollmentStatus: EnrollmentStatus;
  enrollmentDate: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

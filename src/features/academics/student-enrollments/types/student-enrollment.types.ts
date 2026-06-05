export type StudentEnrollmentStatus =
  | "active"
  | "completed"
  | "transferred"
  | "withdrawn";

export type StudentEnrollment = {
  id: string;

  studentId: string;
  classroomId: string;
  academicYearId: string;

  enrollmentDate: string;
  status: StudentEnrollmentStatus;

  createdAt: string;
  updatedAt: string;
};

export type CreateStudentEnrollmentPayload = {
  studentId: string;
  classroomId: string;
  academicYearId: string;
  enrollmentDate: string;
  status: StudentEnrollmentStatus;
};

export type UpdateStudentEnrollmentPayload =
  Partial<CreateStudentEnrollmentPayload>;
export type EnrollmentStatus =
  | "pending_payment"
  | "enrolled"
  | "withdrawn"
  | "transferred"
  | "completed"
  | "cancelled";

export type StudentEnrollment = {
  id: string;
  studentId: string;
  academicYearId: string;
  academicTermId: string;
  gradeId: string;
  classroomId: string;
  enrollmentStatus: EnrollmentStatus;
  enrollmentDate: string;
  activatedAt?: string | null;
  withdrawnAt?: string | null;
  transferredAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EnrollmentStatus =
  | "pending_payment"
  | "enrolled"
  | "withdrawn"
  | "transferred"
  | "completed"
  | "cancelled";

export type EnrollmentSource =
  | "new_registration"
  | "promotion"
  | "transfer_in"
  | "manual";

export type StudentEnrollment = {
  id: string;

  studentId: string;

  academicYearId: string;
  semesterId: string;

  gradeId: string;
  classroomId: string;

  enrollmentCode: string;

  enrollmentStatus: EnrollmentStatus;
  enrollmentSource: EnrollmentSource;

  enrollmentDate: string;

  activatedAt?: string | null;
  withdrawnAt?: string | null;
  transferredAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;

  isActive: boolean;

  notes?: string | null;

  createdAt: string;
  updatedAt: string;
};
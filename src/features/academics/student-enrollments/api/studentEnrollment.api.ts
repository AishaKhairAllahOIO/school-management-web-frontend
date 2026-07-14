import { createMockResourceApi } from "../../shared/api/mockAcademicsStore";
import type { StudentEnrollment } from "../types/student-enrollment.types";

export type CreateStudentEnrollmentPayload = Omit<StudentEnrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateStudentEnrollmentPayload = Partial<CreateStudentEnrollmentPayload>;

export const studentEnrollmentApi = createMockResourceApi<
  StudentEnrollment,
  CreateStudentEnrollmentPayload,
  UpdateStudentEnrollmentPayload
>("studentEnrollments", "enrollment");

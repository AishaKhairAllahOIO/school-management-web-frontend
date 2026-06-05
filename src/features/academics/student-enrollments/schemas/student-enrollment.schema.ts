import { z } from "zod";

export const studentEnrollmentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  classroomId: z.string().min(1, "Classroom is required"),
  academicYearId: z.string().min(1, "Academic year is required"),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  status: z.enum(["active", "completed", "transferred", "withdrawn"]),
});

export type StudentEnrollmentFormValues = z.infer<
  typeof studentEnrollmentSchema
>;
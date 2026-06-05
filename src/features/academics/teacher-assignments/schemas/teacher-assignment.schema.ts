import { z } from "zod";

export const teacherAssignmentSchema = z.object({
  teacherId: z.string().min(1, "Teacher is required"),
  classroomId: z.string().min(1, "Classroom is required"),
  subjectId: z.string().min(1, "Subject is required"),
  academicYearId: z.string().min(1, "Academic year is required"),
  isActive: z.boolean(),
});

export type TeacherAssignmentFormValues = z.infer<
  typeof teacherAssignmentSchema
>;
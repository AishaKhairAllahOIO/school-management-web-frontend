import { z } from "zod";

export const gradeSubjectSchema = z.object({
  gradeId: z.string().min(1, "Grade is required"),
  subjectId: z.string().min(1, "Subject is required"),
  weeklyHours: z.coerce.number().min(1, "Weekly hours is required"),
  isCore: z.boolean(),
  isActive: z.boolean(),
});

export type GradeSubjectFormValues = z.infer<typeof gradeSubjectSchema>;
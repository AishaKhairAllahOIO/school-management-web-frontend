import { z } from "zod";

export const gradeBookEntrySchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  classroomId: z.string().min(1, "Classroom is required"),
  subjectId: z.string().min(1, "Subject is required"),
  teacherAssignmentId: z.string().min(1, "Teacher assignment is required"),

  academicYearId: z.string().min(1, "Academic year is required"),
  termId: z.string().min(1, "Term is required"),

  assessmentTitle: z.string().min(2, "Assessment title is required"),
  assessmentType: z.enum([
    "quiz",
    "exam",
    "homework",
    "project",
    "participation",
  ]),

  score: z.coerce.number().min(0, "Score must be 0 or more"),
  maxScore: z.coerce.number().min(1, "Max score is required"),

  note: z.string().optional().nullable(),
});

export type GradeBookEntryFormValues = z.infer<
  typeof gradeBookEntrySchema
>;
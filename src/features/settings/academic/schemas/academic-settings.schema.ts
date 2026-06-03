import { z } from "zod";

export const academicSettingsSchema = z.object({
  currentAcademicYearId: z.string().min(1, "Academic year is required"),

  academicYears: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      startDate: z.string().min(1),
      endDate: z.string().min(1),
      isCurrent: z.boolean(),
    })
  ),

  terms: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      startDate: z.string().min(1),
      endDate: z.string().min(1),
      status: z.enum(["active", "upcoming", "completed"]),
    })
  ),

  gradeScale: z.array(
    z.object({
      id: z.string(),
      grade: z.string().min(1),
      minimumScore: z.string().min(1),
      maximumScore: z.string().min(1),
      description: z.string().min(1),
    })
  ),

  preferences: z.object({
    autoPromoteStudents: z.boolean(),
    allowStudentRepeating: z.boolean(),
    calculateGpa: z.boolean(),
    rankStudents: z.boolean(),
    useAttendanceInPromotion: z.boolean(),
  }),

  passingGrade: z.string().min(1),
  maximumGrade: z.string().min(1),
  gpaScale: z.enum(["4.0", "5.0", "100"]),
  minimumAttendancePercentage: z.string().min(1),
  promotionThreshold: z.string().min(1),
});

export type AcademicSettingsFormValues = z.infer<
  typeof academicSettingsSchema
>;
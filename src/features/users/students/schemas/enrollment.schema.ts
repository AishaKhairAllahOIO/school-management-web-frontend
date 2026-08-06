import { z } from "zod";

const requiredId = (message: string) =>
  z
    .union([z.string(), z.number()])
    .refine(
      (value) =>
        value !== "" &&
        value !== null &&
        value !== undefined,
      message,
    )
    .transform((value) => String(value));

export const enrollmentSchema = z.object({
  academic_year_id: requiredId("Academic year is required"),

  grade_level_id: requiredId("Grade level is required"),

  class_room_id: requiredId("Classroom is required"),
});

export type EnrollmentSchemaValues = z.infer<
  typeof enrollmentSchema
>;
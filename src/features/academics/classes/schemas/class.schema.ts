import { z } from "zod";

export const classSchema = z.object({
  name: z
    .string()
    .min(2, "Class name is required"),

  level: z
    .string()
    .min(1, "Level is required"),

  sectionsCount: z.coerce
    .number()
    .min(1),

  studentsCount: z.coerce
    .number()
    .min(0),
});

export type ClassSchema =
  z.infer<typeof classSchema>;
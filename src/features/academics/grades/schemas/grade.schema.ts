import { z } from "zod";

export const gradeSchema = z.object({
  name: z.string().min(2, "Grade name is required"),
  code: z.string().min(1, "Grade code is required"),
  order: z.coerce.number().min(1, "Order is required"),
  description: z.string().optional().nullable(),
  isActive: z.boolean(),
});

export type GradeFormValues = z.infer<typeof gradeSchema>;
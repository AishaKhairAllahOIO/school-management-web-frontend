 import { z } from "zod";

const feePlanExtraServiceSchema = z.object({
  type: z.enum([
    "uniform",
    "books",
    "activities",
    "insurance",
    "other",
  ]),
  name: z.string().min(2, "Name is required"),
  amount: z.coerce.number().min(0),
});

export const feePlanSchema = z.object({
  academicYearId: z.coerce.number().min(1, "Academic Year is required"),
  gradeLevelId: z.coerce.number().min(1, "Grade Level is required"),

  
  name: z.string().min(2, "Name is required"),
  baseAmount: z.coerce.number().min(0, "Base Amount is required"),
  extraServices: z.array(feePlanExtraServiceSchema),
});

export type FeePlanFormValues = z.infer<typeof feePlanSchema>;
import { z } from "zod";

const feePlanExtraServiceSchema = z.object({
  type: z.enum([
    "uniform",
    "books",
    "activities",
    "insurance",
    "other",
  ]),

  name: z
    .string()
    .min(2, "Name is required"),

  amount: z
    .number({
      message: "Amount is required",
    })
    .min(0),
});

export const feePlanSchema = z.object({
  academicYearId: z.number(),

  gradeLevelId: z.number(),

  installmentPolicyId: z.number(), // تمت الإضافة
  name: z
    .string()
    .min(2),

  baseAmount: z.number(),

  extraServices: z.array(
    feePlanExtraServiceSchema
  ),
});
export type FeePlanFormValues =
  z.infer<typeof feePlanSchema>;
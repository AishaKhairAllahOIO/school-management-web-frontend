import { z } from "zod";

export const extraServiceSchema = z.object({
  feePlanId: z.string().min(1, "Fee Plan is required"),

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

export type ExtraServiceFormValues =
  z.infer<typeof extraServiceSchema>;
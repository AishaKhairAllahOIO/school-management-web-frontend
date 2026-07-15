import { z } from "zod";

export const extraServiceSchema = z.object({
  feePlanId: z.coerce.number(),

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

  amount: z.coerce
    .number()
    .min(0),
});

export type ExtraServiceFormValues =
  z.infer<typeof extraServiceSchema>;

export type ExtraServiceFormInput =
  z.input<typeof extraServiceSchema>;
import { z } from "zod";

export const contractSchema = z.object({
  studentId: z.coerce.number().min(1, "Please select a student."),
  academicYearId: z.coerce
    .number()
    .min(1, "Academic year could not be resolved."),
  feePlanId: z.coerce.number().min(1, "Please select a fee plan."),
  installmentPolicyId: z.coerce
    .number()
    .min(1, "Please select an installment policy."),
  selectedExtraServiceIds: z.array(z.coerce.number()).default([]),
});

export type ContractFormValues = z.infer<typeof contractSchema>;

export const updateContractSchema = z.object({
  feePlanId: z.coerce
    .number()
    .min(1, "Please select a fee plan."),

  installmentPolicyId: z.coerce
    .number()
    .min(1, "Please select an installment policy."),

  selectedExtraServiceIds: z
    .array(z.coerce.number())
    .default([]),
});

export type UpdateContractFormValues = z.infer<
  typeof updateContractSchema
>;
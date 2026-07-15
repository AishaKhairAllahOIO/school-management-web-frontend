import type {
  FeePlanFormValues,
} from "../../schemas/feePlan.schema";

import type {
  CreateFeePlanPayload,
  UpdateFeePlanPayload,
} from "../../types/payloads.types";

export function mapFeePlanFormToCreatePayload(
  values: FeePlanFormValues
): CreateFeePlanPayload {
  return {
    academicYearId: values.academicYearId,

    gradeLevelId: values.gradeLevelId,

    installmentPolicyId: values.installmentPolicyId,
    
    name: values.name,

    baseAmount: values.baseAmount,

    extraServices: values.extraServices.map(
      (service) => ({
        type: service.type,
        name: service.name,
        amount: service.amount,
      })
    ),
  };
}

export function mapFeePlanFormToUpdatePayload(
  values: FeePlanFormValues
): UpdateFeePlanPayload {
  return {
    academicYearId: values.academicYearId,

    gradeLevelId: values.gradeLevelId,

    name: values.name,

    baseAmount: values.baseAmount,

    extraServices: values.extraServices.map(
      (service) => ({
        type: service.type,
        name: service.name,
        amount: service.amount,
      })
    ),
  };
}
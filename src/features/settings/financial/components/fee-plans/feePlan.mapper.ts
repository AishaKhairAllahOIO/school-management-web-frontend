import type { FeePlan } from "../../types/feePlan.types";
import type { FeePlanFormValues } from "../../schemas/feePlan.schema";

import type {
  CreateFeePlanPayload,
  UpdateFeePlanPayload,
} from "../../types/payloads.types";

import { mapExtraService } from "../extra-services/extraService.mapper";
import { mapInstallmentPolicy } from "../installment-policies/installmentPolicy.mapper";

/* -------------------------------- */
/* API -> Frontend Model            */
/* -------------------------------- */

export function mapFeePlan(api: any): FeePlan {
  return {
    id: Number(api.id),

    academicYearId: Number(
      api.academicYearId ?? api.academic_year_id
    ),

    gradeLevelId: Number(
      api.gradeLevelId ?? api.grade_level_id
    ),

    installmentPolicyId:
      api.installmentPolicyId ??
      api.installment_policy_id
        ? Number(
            api.installmentPolicyId ??
              api.installment_policy_id
          )
        : null,

    name: api.name,

    baseAmount: Number(
      api.baseAmount ?? api.base_amount
    ),

    createdAt:
      api.createdAt ?? api.created_at,

    updatedAt:
      api.updatedAt ?? api.updated_at,

    academicYear:
      api.academicYear ?? api.academic_year,

    gradeLevel:
      api.gradeLevel ?? api.grade_level,

    installmentPolicy:
      api.installment_policy
        ? mapInstallmentPolicy(api.installment_policy)
        : api.installmentPolicy
        ? mapInstallmentPolicy(api.installmentPolicy)
        : null,

    extraServices:
      api.extra_services?.map(mapExtraService) ??
      api.extraServices?.map(mapExtraService) ??
      [],
  };
}

/* -------------------------------- */
/* Form -> Create Payload           */
/* -------------------------------- */

export function mapFeePlanFormToCreatePayload(
  values: FeePlanFormValues
): CreateFeePlanPayload {
  return {
    academicYearId: values.academicYearId,

    gradeLevelId: values.gradeLevelId,

    name: values.name,

    baseAmount: values.baseAmount,

    extraServices: values.extraServices,
  };
}

/* -------------------------------- */
/* Form -> Update Payload           */
/* -------------------------------- */

export function mapFeePlanFormToUpdatePayload(
  values: FeePlanFormValues
): UpdateFeePlanPayload {
  return {
    academicYearId: values.academicYearId,

    gradeLevelId: values.gradeLevelId,

    name: values.name,

    baseAmount: values.baseAmount,

    extraServices: values.extraServices,
  };
}
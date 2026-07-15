import type {
  InstallmentPolicyFormValues,
} from "../../schemas/installmentPolicy.schema";

import type {
  CreateInstallmentPolicyPayload,
  UpdateInstallmentPolicyPayload,
} from "../../types/payloads.types";

export function mapInstallmentPolicyFormToCreatePayload(
  values: InstallmentPolicyFormValues
): CreateInstallmentPolicyPayload {
  return {
    name: values.name,

    items: values.items.map((item) => ({
      title: item.title,

      percentage: item.percentage,

      dueMonth: item.dueMonth,

      dueDay: item.dueDay,
    })),
  };
}

export function mapInstallmentPolicyFormToUpdatePayload(
  values: InstallmentPolicyFormValues
): UpdateInstallmentPolicyPayload {
  return {
    name: values.name,

    items: values.items.map((item) => ({
      title: item.title,

      percentage: item.percentage,

      dueMonth: item.dueMonth,

      dueDay: item.dueDay,
    })),
  };
}
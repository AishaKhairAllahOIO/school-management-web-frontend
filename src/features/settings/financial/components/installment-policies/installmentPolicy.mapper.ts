// installmentPolicy.mapper.ts

import type { InstallmentPolicy } from "../../types/installmentPolicy.types";

export function mapInstallmentPolicy(api: any): InstallmentPolicy {
  return {
    id: Number(api.id),

    name: api.name,

    installmentsCount:
      api.installmentsCount ??
      api.installments_count ??
      api.items?.length ??
      0,

    createdAt:
      api.createdAt ??
      api.created_at,

    updatedAt:
      api.updatedAt ??
      api.updated_at,

    items:
      api.items?.map((item: any) => ({
        id: Number(item.id),

        installmentNumber:
          item.installmentNumber ??
          item.installment_number,

        title: item.title,

        percentage: Number(item.percentage),

        dueMonth:
          item.dueMonth ??
          item.due_month,

        dueDay:
          item.dueDay ??
          item.due_day,

        createdAt:
          item.createdAt ??
          item.created_at,

        updatedAt:
          item.updatedAt ??
          item.updated_at,
      })) ?? [],
  };
}
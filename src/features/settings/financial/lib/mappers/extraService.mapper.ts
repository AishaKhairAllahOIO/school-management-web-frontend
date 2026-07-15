import type { ExtraService } from "../../types/extraService.types";

export function mapExtraService(api: any): ExtraService {
  return {
    id: Number(api.id),

    feePlanId: Number(api.feePlanId ?? api.fee_plan_id ?? 0),
    
    type: api.type,

    name: api.name,

    amount: Number(api.amount),

    createdAt:
      api.createdAt ??
      api.created_at,

    updatedAt:
      api.updatedAt ??
      api.updated_at,
  };
}
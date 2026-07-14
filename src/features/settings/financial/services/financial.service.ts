import { httpService } from "@/services/api/httpService";
import { apiEndpoints } from "@/services/api/apiEndpoints";

import type { FeePlan } from "../types/feePlan.types";
import type { InstallmentPolicy } from "../types/installmentPolicy.types";

import type {
  CreateFeePlanPayload,
  UpdateFeePlanPayload,
  CreateInstallmentPolicyPayload,
  UpdateInstallmentPolicyPayload,
  UpdateExtraServicePayload,
} from "../types/payloads.types";
import type { ExtraService } from "../types/extraService.types";

export const financialService = {
  // ==========================================
  // Installment Policies
  // ==========================================

  getInstallmentPolicies() {
    return httpService.get<InstallmentPolicy[]>(
      apiEndpoints.FINANCIAL.POLICIES
    );
  },

  getInstallmentPolicy(id: number) {
    return httpService.get<InstallmentPolicy>(
      `${apiEndpoints.FINANCIAL.POLICIES}/${id}`
    );
  },

  createInstallmentPolicy(
    payload: CreateInstallmentPolicyPayload
  ) {
    return httpService.post<InstallmentPolicy>(
      apiEndpoints.FINANCIAL.POLICIES,
      payload
    );
  },

  updateInstallmentPolicy(
    id: number,
    payload: UpdateInstallmentPolicyPayload
  ) {
    return httpService.post<InstallmentPolicy>(
      `${apiEndpoints.FINANCIAL.POLICIES}/${id}`,
      payload
    );
  },

  deleteInstallmentPolicy(id: number) {
    return httpService.delete<void>(
      `${apiEndpoints.FINANCIAL.POLICIES}/${id}`
    );
  },

  // ==========================================
  // Fee Plans
  // ==========================================

  getFeePlans() {
    return httpService.get<FeePlan[]>(
      apiEndpoints.FINANCIAL.FEE_PLANS
    );
  },

  getFeePlan(id: number) {
    return httpService.get<FeePlan>(
      `${apiEndpoints.FINANCIAL.FEE_PLANS}/${id}`
    );
  },

  createFeePlan(
    payload: CreateFeePlanPayload
  ) {
    return httpService.post<FeePlan>(
      apiEndpoints.FINANCIAL.FEE_PLANS,
      payload
    );
  },

  updateFeePlan(
    id: number,
    payload: UpdateFeePlanPayload
  ) {
    return httpService.post<FeePlan>(
      `${apiEndpoints.FINANCIAL.FEE_PLANS}/${id}`,
      payload
    );
  },

  deleteFeePlan(id: number) {
    return httpService.delete<void>(
      `${apiEndpoints.FINANCIAL.FEE_PLANS}/${id}`
    );
  },
  // ==========================================
  // Extra Services
  // ==========================================
 getExtraServices(){
    return httpService.get<ExtraService[]>(
      apiEndpoints.FINANCIAL.EXTRA_SERVICES,
    );
 },

 updateExtraService(
  id: string,
  payload: UpdateExtraServicePayload,
 ){
  return httpService.post<ExtraService>(
      `${apiEndpoints.FINANCIAL.EXTRA_SERVICES}/${id}`,
      payload
    );
 },
 deleteExtraService(
  id: string,
 ){
   return httpService.delete<void>(
      `${apiEndpoints.FINANCIAL.EXTRA_SERVICES}/${id}`
    );
 }

};
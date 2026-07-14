import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

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
    return axiosClient.get<InstallmentPolicy[]>(
      API_ENDPOINTS.FINANCIAL.POLICIES
    );
  },

  getInstallmentPolicy(id: number) {
    return axiosClient.get<InstallmentPolicy>(
      `${API_ENDPOINTS.FINANCIAL.POLICIES}/${id}`
    );
  },

  createInstallmentPolicy(
    payload: CreateInstallmentPolicyPayload
  ) {
    return axiosClient.post<InstallmentPolicy>(
      API_ENDPOINTS.FINANCIAL.POLICIES,
      payload
    );
  },

  updateInstallmentPolicy(
    id: number,
    payload: UpdateInstallmentPolicyPayload
  ) {
    return axiosClient.post<InstallmentPolicy>(
      `${API_ENDPOINTS.FINANCIAL.POLICIES}/${id}`,
      payload
    );
  },

  deleteInstallmentPolicy(id: number) {
    return axiosClient.delete<void>(
      `${API_ENDPOINTS.FINANCIAL.POLICIES}/${id}`
    );
  },

  // ==========================================
  // Fee Plans
  // ==========================================

  getFeePlans : async () =>{
    const response =
    await axiosClient.get<ApiResponse<FeePlan[]>>(
        API_ENDPOINTS.FINANCIAL.FEE_PLANS,
    )
     return response.data.data ?? []
    // return axiosClient.get<FeePlan[]>(
    //   API_ENDPOINTS.FINANCIAL.FEE_PLANS
    // );
  },

   getFeePlan: async(id: number)=>{
    const response = await axiosClient.get<ApiResponse<FeePlan>>(
      `${API_ENDPOINTS.FINANCIAL.FEE_PLANS}/${id}`
    )
    return response.data.data ?? []
  },
  // getFeePlan:(id: number) {
  //   return axiosClient.get<FeePlan>(
  //     `${API_ENDPOINTS.FINANCIAL.FEE_PLANS}/${id}`
  //   );
  // },


  createFeePlan(
    payload: CreateFeePlanPayload
  ) {
    return axiosClient.post<FeePlan>(
      API_ENDPOINTS.FINANCIAL.FEE_PLANS,
      payload
    );
  },

  updateFeePlan(
    id: number,
    payload: UpdateFeePlanPayload
  ) {
    return axiosClient.post<FeePlan>(
      `${API_ENDPOINTS.FINANCIAL.FEE_PLANS}/${id}`,
      payload
    );
  },

  deleteFeePlan(id: number) {
    return axiosClient.delete<void>(
      `${API_ENDPOINTS.FINANCIAL.FEE_PLANS}/${id}`
    );
  },
  // ==========================================
  // Extra Services
  // ==========================================
 getExtraServices(){
    return axiosClient.get<ExtraService[]>(
      API_ENDPOINTS.FINANCIAL.EXTRA_SERVICES,
    );
 },

 updateExtraService(
  id: string,
  payload: UpdateExtraServicePayload,
 ){
  return axiosClient.post<ExtraService>(
      `${API_ENDPOINTS.FINANCIAL.EXTRA_SERVICES}/${id}`,
      payload
    );
 },
 deleteExtraService(
  id: string,
 ){
   return axiosClient.delete<void>(
      `${API_ENDPOINTS.FINANCIAL.EXTRA_SERVICES}/${id}`
    );
 }

};
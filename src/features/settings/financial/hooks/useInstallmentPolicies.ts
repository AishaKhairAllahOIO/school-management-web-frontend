import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { financialService } from "../services/financial.service";

import type {
  CreateInstallmentPolicyPayload,
  UpdateInstallmentPolicyPayload,
} from "../types/payloads.types";

const QUERY_KEY = ["installment-policies"];

export function useInstallmentPolicies() {
  const queryClient = useQueryClient();

  const policiesQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => financialService.getInstallmentPolicies(),
  });

  const createPolicy = useMutation({
    mutationFn: (payload: CreateInstallmentPolicyPayload) =>
      financialService.createInstallmentPolicy(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      alert("خطأ في السيرفر (إنشاء): " + (error.response?.data?.message || "راجع تبويبة Network"));
      console.error(error.response);
    }
  });

  const updatePolicy = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateInstallmentPolicyPayload;
    }) => financialService.updateInstallmentPolicy(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    // تمت إضافة معالجة الأخطاء هنا
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      alert("الباك إند رفض التعديل! السبب: \n" + (serverMessage || "تأكد هل الراوت POST أو PUT في api.php"));
      console.error("Edit Error:", error.response);
    }
  });

  const deletePolicy = useMutation({
    mutationFn: (id: number) => financialService.deleteInstallmentPolicy(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    // تمت إضافة معالجة الأخطاء هنا
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      alert("الباك إند رفض الحذف! السبب: \n" + (serverMessage || "غالباً السياسة مرتبطة بخطة رسوم ولا يمكن حذفها."));
      console.error("Delete Error:", error.response);
    }
  });

  return {
    ...policiesQuery,
    createPolicy,
    updatePolicy,
    deletePolicy,
  };
}
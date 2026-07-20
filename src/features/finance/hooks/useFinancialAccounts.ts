import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeOperationsService } from "../services/finance-operations.service";
import type { FinalizeContractPayload, UpdateContractPayload } from "../types/finance.payloads";

const QUERY_KEY = ["financial-accounts"];

export function useFinancialAccounts() {
  const queryClient = useQueryClient();


  const accountsQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: financeOperationsService.getAllAccounts,
  });

  const finalizeContract = useMutation({
    mutationFn: (payload: FinalizeContractPayload) =>
      financeOperationsService.finalizeContract(payload),
    onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      alert("فشل اعتماد العقد: \n" + (serverMessage || "تأكد من صحة البيانات المدخلة."));
      console.error("Finalize Contract Error:", error.response);
    },
  });


  const updateContract = useMutation({
    mutationFn: ({ studentId, payload }: { studentId: number | string; payload: UpdateContractPayload }) =>
      financeOperationsService.updateContract(studentId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      alert("رفض السيرفر التعديل: \n" + (serverMessage || "لا يمكن تعديل عقد يحتوي على دفعات مسددة."));
      console.error("Update Contract Error:", error.response);
    },
  });

  return {
    ...accountsQuery,
    finalizeContract,
    updateContract,
  };
}


export function useStudentFinancialAccount(studentId: string | number | undefined) {
  return useQuery({
    queryKey: ["financial-account", studentId],
    queryFn: () => financeOperationsService.getAccountByStudentId(studentId!),
    enabled: !!studentId,  
  });
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeOperationsService } from "../services/finance-operations.service";
import type { ProcessPaymentPayload, UpdatePaymentPayload } from "../types/finance.payloads";

const QUERY_KEY = ["payments-ledger"];
const ACCOUNTS_QUERY_KEY = ["financial-accounts"];  

export function usePayments() {
  const queryClient = useQueryClient();


  const paymentsQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: financeOperationsService.getAllPayments,
  });


  const processPayment = useMutation({
    mutationFn: (payload: ProcessPaymentPayload) =>
      financeOperationsService.processPayment(payload),
    onSuccess: async () => {

      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      alert("فشل تسجيل الدفعة: \n" + (serverMessage || "تأكد من صحة البيانات."));
    },
  });


  const deletePayment = useMutation({
    mutationFn: (id: string | number) => financeOperationsService.deletePayment(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });

  return {
    ...paymentsQuery,
    processPayment,
    deletePayment,
  };
}
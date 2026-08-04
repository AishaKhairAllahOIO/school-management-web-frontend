import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { financeOperationsService } from "../services/finance-operations.service";
import type {
  ProcessPaymentPayload,
  UpdatePaymentPayload,
} from "../types/finance.payloads";

export const paymentsQueryKey = ["payments-ledger"] as const;
const accountsQueryKey = ["financial-accounts"] as const;

function errorMessage(error: unknown, fallback: string) {
  const candidate = error as {
    response?: { data?: { message?: string } };
  };
  return candidate.response?.data?.message || fallback;
}

async function invalidatePaymentDependencies(
  queryClient: ReturnType<typeof useQueryClient>,
  studentId?: string | number,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: paymentsQueryKey }),
    queryClient.invalidateQueries({ queryKey: accountsQueryKey }),
    queryClient.invalidateQueries({ queryKey: ["installments-list"] }),
    studentId !== undefined
      ? queryClient.invalidateQueries({
          queryKey: ["financial-account", studentId],
        })
      : queryClient.invalidateQueries({ queryKey: ["financial-account"] }),
  ]);
}

export function usePayments() {
  const queryClient = useQueryClient();

  const paymentsQuery = useQuery({
    queryKey: paymentsQueryKey,
    queryFn: financeOperationsService.getAllPayments,
  });

  const processPayment = useMutation({
    mutationFn: (payload: ProcessPaymentPayload) =>
      financeOperationsService.processPayment(payload),
    onSuccess: async (_, payload) => {
      await invalidatePaymentDependencies(queryClient, payload.studentId);
      toast.success("Payment recorded successfully.");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Payment could not be recorded."));
    },
  });

  const updatePayment = useMutation({
    mutationFn: ({
      id,
      studentId,
      payload,
    }: {
      id: string | number;
      studentId?: string | number;
      payload: UpdatePaymentPayload;
    }) => financeOperationsService.updatePayment(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        invalidatePaymentDependencies(queryClient, variables.studentId),
        queryClient.invalidateQueries({
          queryKey: ["payment-receipt", variables.id],
        }),
      ]);
      toast.success("Payment details updated.");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Payment could not be updated."));
    },
  });

  const deletePayment = useMutation({
    mutationFn: ({
      id,
      studentId,
    }: {
      id: string | number;
      studentId?: string | number;
    }) => financeOperationsService.deletePayment(id),
    onSuccess: async (_, variables) => {
      await invalidatePaymentDependencies(queryClient, variables.studentId);
      toast.success("Payment deleted successfully.");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Payment could not be deleted."));
    },
  });

  return {
    ...paymentsQuery,
    processPayment,
    updatePayment,
    deletePayment,
  };
}

export function usePaymentDetails(
  paymentId: string | number | null | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ["payment-receipt", paymentId],
    queryFn: () => financeOperationsService.getPaymentDetails(paymentId!),
    enabled: enabled && paymentId !== null && paymentId !== undefined,
  });
}

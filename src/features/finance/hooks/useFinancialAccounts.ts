import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { financeOperationsService } from "../services/finance-operations.service";
import type {
  FinalizeContractPayload,
  UpdateContractPayload,
} from "../types/finance.payloads";

const queryKey = ["financial-accounts"] as const;

function errorMessage(error: unknown, fallback: string) {
  const candidate = error as {
    response?: { data?: { message?: string } };
  };
  return candidate.response?.data?.message || fallback;
}

export function useFinancialAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey,
    queryFn: financeOperationsService.getAllAccounts,
  });

  const finalizeContract = useMutation({
    mutationFn: (payload: FinalizeContractPayload) =>
      financeOperationsService.finalizeContract(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success("Student contract created successfully.");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Contract could not be created."));
    },
  });

  const updateContract = useMutation({
    mutationFn: ({
      studentId,
      payload,
    }: {
      studentId: number | string;
      payload: UpdateContractPayload;
    }) => financeOperationsService.updateContract(studentId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success("Contract updated successfully.");
    },
    onError: (error) => {
      toast.error(
        errorMessage(
          error,
          "Contract could not be updated. A contract with recorded payments may be locked.",
        ),
      );
    },
  });

  return {
    ...accountsQuery,
    finalizeContract,
    updateContract,
  };
}

export function useStudentFinancialAccount(
  studentId: string | number | undefined,
) {
  return useQuery({
    queryKey: ["financial-account", studentId],
    queryFn: () => financeOperationsService.getAccountByStudentId(studentId!),
    enabled: studentId !== undefined && studentId !== null,
  });
}

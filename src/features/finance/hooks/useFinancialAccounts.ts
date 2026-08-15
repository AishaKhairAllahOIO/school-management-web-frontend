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

export const financialAccountsQueryKey = ["financial-accounts"] as const;

export const studentFinancialAccountQueryKey = (
  studentId: string | number,
) => ["financial-account", studentId] as const;

function errorMessage(error: unknown, fallback: string) {
  const candidate = error as {
    response?: { data?: { message?: string } };
  };

  return candidate.response?.data?.message || fallback;
}

async function invalidateStudentFinance(
  queryClient: ReturnType<typeof useQueryClient>,
  studentId?: string | number,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: financialAccountsQueryKey }),
    queryClient.invalidateQueries({ queryKey: ["installments-list"] }),
    queryClient.invalidateQueries({ queryKey: ["payments-ledger"] }),
    studentId !== undefined
      ? queryClient.invalidateQueries({
          queryKey: studentFinancialAccountQueryKey(studentId),
        })
      : queryClient.invalidateQueries({ queryKey: ["financial-account"] }),
  ]);
}

export function useFinancialAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: financialAccountsQueryKey,
    queryFn: financeOperationsService.getAllAccounts,
  });

  const finalizeContract = useMutation({
    mutationFn: (payload: FinalizeContractPayload) =>
      financeOperationsService.finalizeContract(payload),
    onSuccess: async (_, payload) => {
      await invalidateStudentFinance(queryClient, payload.studentId);
      toast.success("Student contract created successfully.");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Contract could not be created."));
    },
  });

  const updateContract = useMutation({
    mutationFn: ({
      accountId,
      payload,
    }: {
      accountId: number | string;
      studentId: number | string;
      payload: UpdateContractPayload;
    }) => financeOperationsService.updateContract(accountId, payload),
    onSuccess: async (_, variables) => {
      await invalidateStudentFinance(queryClient, variables.studentId);
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
  enabled = true,
) {
  const hasStudentId = studentId !== undefined && studentId !== null;

  return useQuery({
    queryKey: hasStudentId
      ? studentFinancialAccountQueryKey(studentId!)
      : ["financial-account", "missing"],
    queryFn: () => financeOperationsService.getAccountByStudentId(studentId!),
    enabled: enabled && hasStudentId,
    retry: false,
  });
}

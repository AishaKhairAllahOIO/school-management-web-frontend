import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { financeApi } from "../api/finance.api";

import type {
  FinalizeContractPayload,
  UpdateContractPayload,
} from "../types/finance.payloads";

export const financeAccountsKeys = {
  all: ["financial-accounts"] as const,

  student: (studentId: string | number) =>
    ["financial-accounts", "student", studentId] as const,
};

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<
              string,
              string[] | string
            >;
          };
        };
      }
    ).response;

    const message = response?.data?.message;

    if (message) {
      return message;
    }

    const errors = response?.data?.errors;

    if (errors) {
      const firstError = Object.values(errors)[0];

      if (Array.isArray(firstError)) {
        return firstError[0] ?? fallback;
      }

      if (typeof firstError === "string") {
        return firstError;
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function useFinanceAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: financeAccountsKeys.all,
    queryFn: financeApi.getAccounts,
  });

  const finalizeContract = useMutation({
    mutationFn: (
      payload: FinalizeContractPayload,
    ) => financeApi.finalizeContract(payload),

    onSuccess: async (_, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: financeAccountsKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: financeAccountsKeys.student(
            payload.studentId,
          ),
        }),
      ]);

      toast.success(
        "Student contract created successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          "Contract could not be created.",
        ),
      );
    },
  });

  const updateContract = useMutation({
    mutationFn: ({
      accountId,
      payload,
    }: {
      accountId: string | number;
      studentId: string | number;
      payload: UpdateContractPayload;
    }) =>
      financeApi.updateContract(
        accountId,
        payload,
      ),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: financeAccountsKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: financeAccountsKeys.student(
            variables.studentId,
          ),
        }),
      ]);

      toast.success(
        "Contract updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          "Contract could not be updated. A contract with recorded payments may be locked.",
        ),
      );
    },
  });

  return {
    accountsQuery,
    finalizeContract,
    updateContract,
  };
}

export function useStudentFinancialAccount(
  studentId: string | number | undefined,
  enabled = true,
) {
  const hasStudentId =
    studentId !== undefined &&
    studentId !== null;

  return useQuery({
    queryKey: hasStudentId
      ? financeAccountsKeys.student(studentId)
      : ["financial-account", "missing"],

    queryFn: () =>
      financeApi.getAccountByStudent(
        studentId!,
      ),

    enabled:
      enabled && hasStudentId,

    retry: false,
  });
}
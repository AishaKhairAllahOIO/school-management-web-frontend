import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { financeApi } from "../api/studentFinance.api";

import {
  studentInstallmentKeys,
} from "./useStudentInstallments";

import {
  studentPaymentKeys,
} from "./useStudentPayments";

import type {
  FinalizeContractPayload,
  UpdateContractPayload,
} from "../types/studentFinance.payloads";

/* -------------------------------------------------------------------------- */
/* Query keys                                                                 */
/* -------------------------------------------------------------------------- */

export const studentFinancialAccountKeys = {
  all: ["financial-accounts"] as const,

  student: (
    studentId: string | number,
  ) =>
    [
      "financial-accounts",
      "student",
      studentId,
    ] as const,
};

/* -------------------------------------------------------------------------- */
/* Error helper                                                               */
/* -------------------------------------------------------------------------- */

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

    const message =
      response?.data?.message;

    if (message) {
      return message;
    }

    const errors =
      response?.data?.errors;

    if (errors) {
      const firstError =
        Object.values(errors)[0];

      if (Array.isArray(firstError)) {
        return (
          firstError[0] ??
          fallback
        );
      }

      if (
        typeof firstError === "string"
      ) {
        return firstError;
      }
    }
  }

  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

/* -------------------------------------------------------------------------- */
/* Finance refresh                                                            */
/* -------------------------------------------------------------------------- */

async function invalidateStudentFinance(
  queryClient: ReturnType<
    typeof useQueryClient
  >,
  studentId: string | number,
) {
  /*
   * We intentionally invalidate all related
   * finance resources together.
   *
   * No setTimeout is needed in the page.
   */
  await Promise.allSettled([
    queryClient.invalidateQueries({
      queryKey:
        studentFinancialAccountKeys.all,
      refetchType: "active",
    }),

    queryClient.invalidateQueries({
      queryKey:
        studentFinancialAccountKeys.student(
          studentId,
        ),
      refetchType: "active",
    }),

    queryClient.invalidateQueries({
      queryKey:
        studentInstallmentKeys.all,
      refetchType: "active",
    }),

    queryClient.invalidateQueries({
      queryKey:
        studentInstallmentKeys.byStudent(
          studentId,
        ),
      refetchType: "active",
    }),

    queryClient.invalidateQueries({
      queryKey:
        studentPaymentKeys.all,
      refetchType: "active",
    }),
  ]);
}

/* -------------------------------------------------------------------------- */
/* Finance accounts                                                           */
/* -------------------------------------------------------------------------- */

export function useStudentFinancialAccounts() {
  const queryClient =
    useQueryClient();

  const accountsQuery =
    useQuery({
      queryKey:
        studentFinancialAccountKeys.all,

      queryFn:
        financeApi.getAccounts,

      staleTime: 0,
    });

  /* ------------------------------------------------------------------------ */
  /* Create / finalize contract                                               */
  /* ------------------------------------------------------------------------ */

  const finalizeContract =
    useMutation({
      mutationFn: (
        payload: FinalizeContractPayload,
      ) =>
        financeApi.finalizeContract(
          payload,
        ),

      onSuccess: async (
        result,
        payload,
      ) => {
        queryClient.setQueryData(
          studentFinancialAccountKeys.student(payload.studentId),
          result,
        );

        if (Array.isArray(result.installments)) {
          queryClient.setQueryData(
            studentInstallmentKeys.byStudent(payload.studentId),
            result.installments,
          );
        }

        await invalidateStudentFinance(
          queryClient,
          payload.studentId,
        );

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

  /* ------------------------------------------------------------------------ */
  /* Update contract                                                          */
  /* ------------------------------------------------------------------------ */

  const updateContract =
    useMutation({
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

      onSuccess: async (
        result,
        variables,
      ) => {
        queryClient.setQueryData(
          studentFinancialAccountKeys.student(variables.studentId),
          result,
        );

        if (Array.isArray(result.installments)) {
          queryClient.setQueryData(
            studentInstallmentKeys.byStudent(variables.studentId),
            result.installments,
          );
        }

        await invalidateStudentFinance(
          queryClient,
          variables.studentId,
        );

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

/* -------------------------------------------------------------------------- */
/* Student financial account                                                  */
/* -------------------------------------------------------------------------- */

export function useStudentFinancialAccount(
  studentId:
    | string
    | number
    | undefined,
  enabled = true,
) {
  const hasStudentId =
    studentId !== undefined &&
    studentId !== null;

  return useQuery({
    queryKey: hasStudentId
      ? studentFinancialAccountKeys.student(
          studentId,
        )
      : [
          "financial-account",
          "missing",
        ],

    queryFn: () =>
      financeApi.getAccountByStudent(
        studentId!,
      ),

    enabled:
      enabled && hasStudentId,

    retry: false,

    staleTime: 0,
  });
}
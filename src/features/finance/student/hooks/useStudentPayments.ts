import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { financeApi } from "../api/studentFinance.api";

import {
  studentFinancialAccountKeys,
} from "./useStudentFinancialAccounts";

import {
  studentInstallmentKeys,
} from "./useStudentInstallments";

import type {
  ProcessPaymentPayload,
  UpdatePaymentPayload,
} from "../types/studentFinance.payloads";

/* -------------------------------------------------------------------------- */
/* Query keys                                                                 */
/* -------------------------------------------------------------------------- */

export const studentPaymentKeys = {
  all: ["student-finance-payments"] as const,

  byStudent: (
    studentId: string | number,
    accountId?: string | number,
  ) =>
    [
      "student-finance-payments",
      "student",
      studentId,
      accountId ?? "all-accounts",
    ] as const,

  detail: (
    paymentId: string | number,
  ) =>
    [
      "finance-payment",
      paymentId,
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
/* Invalidate finance data                                                    */
/* -------------------------------------------------------------------------- */

async function invalidateFinanceQueries(
  queryClient: ReturnType<
    typeof useQueryClient
  >,
  studentId?: string | number,
) {
  const requests: Promise<unknown>[] = [
    queryClient.invalidateQueries({
      queryKey:
        studentPaymentKeys.all,
      refetchType: "active",
    }),

    queryClient.invalidateQueries({
      queryKey:
        studentInstallmentKeys.all,
      refetchType: "active",
    }),

    queryClient.invalidateQueries({
      queryKey:
        studentFinancialAccountKeys.all,
      refetchType: "active",
    }),
  ];

  if (
    studentId !== undefined &&
    studentId !== null
  ) {
    requests.push(
      queryClient.invalidateQueries({
        queryKey:
          studentFinancialAccountKeys.student(
            studentId,
          ),
        refetchType: "active",
      }),

      queryClient.invalidateQueries({
        queryKey:
          studentInstallmentKeys.byStudent(
            studentId,
          ),
        refetchType: "active",
      }),
    );
  }

  await Promise.allSettled(
    requests,
  );
}

/* -------------------------------------------------------------------------- */
/* Payments hook                                                              */
/* -------------------------------------------------------------------------- */

export function useStudentPayments(
  studentId?: string | number,
  accountId?: string | number,
  enabled = true,
) {
  const queryClient =
    useQueryClient();

  const hasStudentId =
    studentId !== undefined &&
    studentId !== null;

  /* ------------------------------------------------------------------------ */
  /* Payments list                                                            */
  /* ------------------------------------------------------------------------ */

  const paymentsQuery =
    useQuery({
      queryKey: hasStudentId
        ? studentPaymentKeys.byStudent(studentId!, accountId)
        : [...studentPaymentKeys.all, "missing"],

      queryFn: () =>
        financeApi.getPaymentsByStudent(studentId!, accountId),

      enabled: enabled && hasStudentId,
      retry: false,
      staleTime: 0,
    });

  /* ------------------------------------------------------------------------ */
  /* Create payment                                                           */
  /* ------------------------------------------------------------------------ */

  const processPayment =
    useMutation({
      mutationFn: (
        payload: ProcessPaymentPayload,
      ) =>
        financeApi.processPayment(
          payload,
        ),

      onSuccess: async (
        _result,
        payload,
      ) => {
        await invalidateFinanceQueries(
          queryClient,
          payload.studentId,
        );

        toast.success(
          "Payment recorded successfully.",
        );
      },

      onError: (error) => {
        toast.error(
          getErrorMessage(
            error,
            "Payment could not be recorded.",
          ),
        );
      },
    });

  /* ------------------------------------------------------------------------ */
  /* Update payment                                                           */
  /* ------------------------------------------------------------------------ */

  const updatePayment =
    useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string | number;
        studentId?: string | number;
        payload: UpdatePaymentPayload;
      }) =>
        financeApi.updatePayment(
          id,
          payload,
        ),

      onSuccess: async (
        _result,
        variables,
      ) => {
        await invalidateFinanceQueries(
          queryClient,
          variables.studentId,
        );

        queryClient.removeQueries({
          queryKey:
            studentPaymentKeys.detail(
              variables.id,
            ),
        });

        toast.success(
          "Payment details updated.",
        );
      },

      onError: (error) => {
        toast.error(
          getErrorMessage(
            error,
            "Payment could not be updated.",
          ),
        );
      },
    });

  /* ------------------------------------------------------------------------ */
  /* Delete payment                                                           */
  /* ------------------------------------------------------------------------ */

  const deletePayment =
    useMutation({
      mutationFn: ({
        id,
      }: {
        id: string | number;
        studentId?: string | number;
      }) =>
        financeApi.deletePayment(
          id,
        ),

      onSuccess: async (
        _result,
        variables,
      ) => {
        queryClient.removeQueries({
          queryKey:
            studentPaymentKeys.detail(
              variables.id,
            ),
        });

        await invalidateFinanceQueries(
          queryClient,
          variables.studentId,
        );

        toast.success(
          "Payment deleted successfully.",
        );
      },

      onError: (error) => {
        toast.error(
          getErrorMessage(
            error,
            "Payment could not be deleted.",
          ),
        );
      },
    });

  return {
    ...paymentsQuery,

    processPayment,

    updatePayment,

    deletePayment,
  };
}

/* -------------------------------------------------------------------------- */
/* Single payment                                                             */
/* -------------------------------------------------------------------------- */

export function useFinancePayment(
  paymentId:
    | string
    | number
    | undefined,
  enabled = true,
) {
  const hasId =
    paymentId !== undefined &&
    paymentId !== null;

  return useQuery({
    queryKey: hasId
      ? studentPaymentKeys.detail(
          paymentId,
        )
      : [
          "finance-payment",
          "missing",
        ],

    queryFn: () =>
      financeApi.getPayment(
        paymentId!,
      ),

    enabled:
      enabled && hasId,

    retry: false,
  });
}
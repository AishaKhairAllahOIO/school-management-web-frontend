import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { financeApi } from "../api/finance.api";

import {
  financeAccountsKeys,
} from "./useFinancialAccounts";

import {
  financeInstallmentsKeys,
} from "./useInstallments";

import type {
  ProcessPaymentPayload,
  UpdatePaymentPayload,
} from "../types/finance.payloads";

export const financePaymentsKeys = {
  all: ["finance-payments"] as const,

  detail: (
    paymentId: string | number,
  ) =>
    ["finance-payment", paymentId] as const,
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
          firstError[0] ?? fallback
        );
      }

      if (
        typeof firstError ===
        "string"
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

export function useFinancePayments() {
  const queryClient =
    useQueryClient();

  const paymentsQuery = useQuery({
    queryKey:
      financePaymentsKeys.all,
    queryFn:
      financeApi.getPayments,
  });

  const invalidateFinance =
    async (
      studentId?:
        | string
        | number,
    ) => {
      const queries = [
        queryClient.invalidateQueries({
          queryKey:
            financePaymentsKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey:
            financeInstallmentsKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey:
            financeAccountsKeys.all,
        }),
      ];

      if (
        studentId !== undefined
      ) {
        queries.push(
          queryClient.invalidateQueries(
            {
              queryKey:
                financeAccountsKeys.student(
                  studentId,
                ),
            },
          ),
        );
      }

      await Promise.all(queries);
    };

  /**
   * 9. Create payment
   */
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
        await invalidateFinance(
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

  /**
   * 10. Update payment
   */
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
        await invalidateFinance(
          variables.studentId,
        );

        await queryClient.invalidateQueries(
          {
            queryKey:
              financePaymentsKeys.detail(
                variables.id,
              ),
          },
        );

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

  /**
   * 11. Delete payment
   */
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
        await invalidateFinance(
          variables.studentId,
        );

        await queryClient.invalidateQueries(
          {
            queryKey:
              financePaymentsKeys.detail(
                variables.id,
              ),
          },
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
      ? financePaymentsKeys.detail(
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
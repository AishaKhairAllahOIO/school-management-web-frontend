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

/* -------------------------------------------------------------------------- */
/* Query keys                                                                 */
/* -------------------------------------------------------------------------- */

export const financePaymentsKeys = {
  all: ["finance-payments"] as const,

  detail: (
    paymentId: string | number,
  ) =>
    ["finance-payment", paymentId] as const,
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
          firstError[0] ?? fallback
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
/* Finance cache invalidation                                                 */
/* -------------------------------------------------------------------------- */

async function invalidateFinanceQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  studentId?: string | number,
) {
  const invalidations: Promise<unknown>[] = [
    queryClient.invalidateQueries({
      queryKey:
        financePaymentsKeys.all,
      refetchType: "active",
    }),

    queryClient.invalidateQueries({
      queryKey:
        financeInstallmentsKeys.all,
      refetchType: "active",
    }),

    queryClient.invalidateQueries({
      queryKey:
        financeAccountsKeys.all,
      refetchType: "active",
    }),
  ];

  if (studentId !== undefined) {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey:
          financeAccountsKeys.student(
            studentId,
        ),
        refetchType: "active",
      }),
    );
  }

  /*
   * Do not allow a cache-refresh problem to turn
   * a successful backend mutation into a failed mutation.
   *
   * The actual POST/PATCH/DELETE request has already
   * succeeded at this point.
   */
  await Promise.allSettled(
    invalidations,
  );
}

/* -------------------------------------------------------------------------- */
/* Main payments hook                                                         */
/* -------------------------------------------------------------------------- */

export function useFinancePayments() {
  const queryClient =
    useQueryClient();

  /* ------------------------------------------------------------------------ */
  /* Payments list                                                            */
  /* ------------------------------------------------------------------------ */

  const paymentsQuery = useQuery({
    queryKey:
      financePaymentsKeys.all,

    queryFn:
      financeApi.getPayments,

    /*
     * Keep the previous data visible while
     * React Query refreshes the table.
     */
    placeholderData: (previousData) =>
      previousData,

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
        /*
         * First update/invalidate the relevant
         * finance queries.
         */
        await invalidateFinanceQueries(
          queryClient,
          payload.studentId,
        );

        /*
         * Success toast.
         */
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

        /*
         * Refresh the individual payment query.
         */
        await Promise.allSettled([
          queryClient.invalidateQueries({
            queryKey:
              financePaymentsKeys.detail(
                variables.id,
              ),
          }),
        ]);

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

      /*
       * IMPORTANT:
       *
       * We do NOT depend on cache invalidation
       * for the DELETE request itself to be considered
       * successful.
       *
       * The API deletion has already succeeded when
       * this callback is executed.
       */
      onSuccess: async (
        _result,
        variables,
      ) => {
        const paymentId =
          variables.id;

        /*
         * Immediately remove the deleted payment
         * from the individual cache.
         */
        queryClient.removeQueries({
          queryKey:
            financePaymentsKeys.detail(
              paymentId,
            ),
        });

        /*
         * Mark all relevant finance data as stale
         * and refresh active queries.
         *
         * Promise.allSettled guarantees that a problem
         * in one refresh cannot make the successful
         * DELETE mutation appear to have failed.
         */
        await invalidateFinanceQueries(
          queryClient,
          variables.studentId,
        );

        /*
         * IMPORTANT:
         *
         * The success notification is emitted only
         * after the delete succeeded.
         */
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

  /* ------------------------------------------------------------------------ */
  /* Return                                                                   */
  /* ------------------------------------------------------------------------ */

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
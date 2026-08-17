import { useQuery } from "@tanstack/react-query";

import { financeApi } from "../api/finance.api";

export const financeInstallmentsKeys = {
  all: ["finance-installments"] as const,

  detail: (
    installmentId: string | number,
  ) =>
    [
      "finance-installment",
      installmentId,
    ] as const,
};

export function useFinanceInstallments() {
  return useQuery({
    queryKey: financeInstallmentsKeys.all,
    queryFn: financeApi.getInstallments,
  });
}

export function useFinanceInstallment(
  installmentId: string | number | undefined,
  enabled = true,
) {
  const hasId =
    installmentId !== undefined &&
    installmentId !== null;

  return useQuery({
    queryKey: hasId
      ? financeInstallmentsKeys.detail(
          installmentId,
        )
      : [
          "finance-installment",
          "missing",
        ],

    queryFn: () =>
      financeApi.getInstallment(
        installmentId!,
      ),

    enabled:
      enabled && hasId,

    retry: false,
  });
}
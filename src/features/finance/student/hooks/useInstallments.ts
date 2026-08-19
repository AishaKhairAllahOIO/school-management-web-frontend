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

     byStudent: (studentId: string | number) =>
    ["finance-installments", "student", studentId] as const,
};

export function useStudentInstallments(
  studentId: string | number | undefined,
  enabled = true,
) {
  const hasStudentId =
    studentId !== undefined &&
    studentId !== null;

  return useQuery({
    queryKey: hasStudentId
      ? financeInstallmentsKeys.byStudent(studentId)
      : ["finance-installments", "student", "missing"],

    queryFn: () =>
      financeApi.getStudentInstallments(
        studentId!,
      ),

    enabled:
      enabled && hasStudentId,

    retry: false,
  });
}

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
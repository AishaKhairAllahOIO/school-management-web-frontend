import { useQuery } from "@tanstack/react-query";

import { financeApi } from "../api/studentFinance.api";

/* -------------------------------------------------------------------------- */
/* Query keys                                                                 */
/* -------------------------------------------------------------------------- */

export const studentInstallmentKeys = {
  all: ["finance-installments"] as const,

  detail: (installmentId: string | number) =>
    ["finance-installment", installmentId] as const,

  byStudent: (studentId: string | number) =>
    ["finance-installments", "student", studentId] as const,
};

/* -------------------------------------------------------------------------- */
/* Student installments                                                       */
/* -------------------------------------------------------------------------- */

export function useStudentInstallments(
  studentId: string | number | undefined,
  enabled = true,
) {
  const hasStudentId =
    studentId !== undefined &&
    studentId !== null;

  return useQuery({
    queryKey: hasStudentId
      ? studentInstallmentKeys.byStudent(studentId)
      : [
          "finance-installments",
          "student",
          "missing",
        ],

    queryFn: () =>
      financeApi.getStudentInstallments(
        studentId!,
      ),

    enabled:
      enabled && hasStudentId,

    retry: false,

    /*
     * Do not keep an old student's installments
     * while switching between students.
     */
    placeholderData: undefined,

    staleTime: 0,
  });
}

/* -------------------------------------------------------------------------- */
/* All installments                                                           */
/* -------------------------------------------------------------------------- */

export function useAllStudentInstallments() {
  return useQuery({
    queryKey:
      studentInstallmentKeys.all,

    queryFn:
      financeApi.getInstallments,

    staleTime: 0,
  });
}

/* -------------------------------------------------------------------------- */
/* Single installment                                                         */
/* -------------------------------------------------------------------------- */

export function useStudentInstallment(
  installmentId:
    | string
    | number
    | undefined,
  enabled = true,
) {
  const hasId =
    installmentId !== undefined &&
    installmentId !== null;

  return useQuery({
    queryKey: hasId
      ? studentInstallmentKeys.detail(
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
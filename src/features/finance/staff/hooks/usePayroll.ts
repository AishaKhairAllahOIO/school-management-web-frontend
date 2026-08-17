import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { payrollApi } from "../api/payroll.api";

import type {
  ApiId,
  CommitPayrollPayload,
  PayrollPreviewPayload,
  UpdatePayrollPayload,
} from "../types/payroll.types";

export const payrollKeys = {
  all: ["staff-payroll"] as const,

  monthly: (
    year: number,
    month: number,
  ) =>
    [
      ...payrollKeys.all,
      "monthly",
      year,
      month,
    ] as const,

  staff: (staffId: ApiId) =>
    [
      ...payrollKeys.all,
      "staff",
      staffId,
    ] as const,

  detail: (id: ApiId) =>
    [
      ...payrollKeys.all,
      "detail",
      id,
    ] as const,
};

/* =========================
   Preview
========================= */

export function usePayrollPreview() {
  return useMutation({
    mutationFn: (
      payload: PayrollPreviewPayload,
    ) =>
      payrollApi.previewPayroll(payload),
  });
}

/* =========================
   Commit
========================= */

export function useCommitPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CommitPayrollPayload,
    ) =>
      payrollApi.commitPayroll(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.monthly(
          variables.year,
          variables.month,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: payrollKeys.staff(
          variables.staff_id,
        ),
      });
    },
  });
}

/* =========================
   Monthly
========================= */

export function useMonthlyPayrolls(
  year: number,
  month: number,
  enabled = true,
) {
  return useQuery({
    queryKey: payrollKeys.monthly(
      year,
      month,
    ),

    queryFn: () =>
      payrollApi.getMonthlyPayrolls(
        year,
        month,
      ),

    enabled,
  });
}

/* =========================
   Staff
========================= */

export function useStaffPayrolls(
  staffId?: ApiId,
) {
  return useQuery({
    queryKey: payrollKeys.staff(
      staffId ?? "none",
    ),

    queryFn: () =>
      payrollApi.getStaffPayrolls(
        staffId!,
      ),

    enabled: Boolean(staffId),
  });
}

/* =========================
   Detail
========================= */

export function usePayroll(
  id?: ApiId,
) {
  return useQuery({
    queryKey: payrollKeys.detail(
      id ?? "none",
    ),

    queryFn: () =>
      payrollApi.getPayroll(id!),

    enabled: Boolean(id),
  });
}

/* =========================
   Update
========================= */

export function useUpdatePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: ApiId;
      payload: UpdatePayrollPayload;
    }) =>
      payrollApi.updatePayroll(
        id,
        payload,
      ),

    onSuccess: (response) => {
      const payroll =
        response.data;

      queryClient.invalidateQueries({
        queryKey:
          payrollKeys.detail(
            payroll.id,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          payrollKeys.monthly(
            payroll.year,
            payroll.month,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          payrollKeys.staff(
            payroll.staff_id,
          ),
      });
    },
  });
}

/* =========================
   Delete
========================= */

export function useDeletePayroll() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: ApiId,
    ) =>
      payrollApi.deletePayroll(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          payrollKeys.all,
      });
    },
  });
}
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { payrollApi } from "../api/payroll.api";

import type {
  ApiId,
  CreateContractPayload,
  UpdateContractPayload,
} from "../types/payroll.types";

export const contractKeys = {
  all: ["staff-financial-contracts"] as const,

  list: (
    staffId?: ApiId,
    academicYearId?: ApiId,
  ) =>
    [
      ...contractKeys.all,
      "list",
      staffId ?? "all",
      academicYearId ?? "all",
    ] as const,

  detail: (id: ApiId) =>
    [...contractKeys.all, "detail", id] as const,
};

export function useStaffContracts(params?: {
  staff_id?: ApiId;
  academic_year_id?: ApiId;
}) {
  return useQuery({
    queryKey: contractKeys.list(
      params?.staff_id,
      params?.academic_year_id,
    ),

    queryFn: () =>
      payrollApi.getContracts(params),
  });
}

export function useContract(id?: ApiId) {
  return useQuery({
    queryKey: contractKeys.detail(id ?? "none"),

    queryFn: () =>
      payrollApi.getContract(id!),

    enabled: Boolean(id),
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateContractPayload,
    ) => payrollApi.createContract(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.all,
      });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: ApiId;
      payload: UpdateContractPayload;
    }) =>
      payrollApi.updateContract(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: contractKeys.detail(
          variables.id,
        ),
      });
    },
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: ApiId) =>
      payrollApi.deleteContract(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.all,
      });
    },
  });
}
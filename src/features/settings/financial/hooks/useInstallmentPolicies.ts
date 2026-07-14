import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { financialService } from "../services/financial.service";

import type {
  CreateInstallmentPolicyPayload,
  UpdateInstallmentPolicyPayload,
} from "../types/payloads.types";

const QUERY_KEY = ["installment-policies"];

export function useInstallmentPolicies() {
  const queryClient = useQueryClient();

  const policiesQuery = useQuery({
    queryKey: QUERY_KEY,

    queryFn: () =>
      financialService.getInstallmentPolicies(),
  });

  const createPolicy = useMutation({
    mutationFn: (
      payload: CreateInstallmentPolicyPayload
    ) =>
      financialService.createInstallmentPolicy(
        payload
      ),

    onSuccess: async() => {
     await queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  const updatePolicy = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;

      payload: UpdateInstallmentPolicyPayload;
    }) =>
      financialService.updateInstallmentPolicy(
        id,
        payload
      ),

    onSuccess: async() => {
     await queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  const deletePolicy = useMutation({
    mutationFn: (id: number) =>
      financialService.deleteInstallmentPolicy(
        id
      ),

    onSuccess: async() => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  return {
    ...policiesQuery,

    createPolicy,

    updatePolicy,

    deletePolicy,
  };
}
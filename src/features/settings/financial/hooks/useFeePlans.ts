import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { financialService } from "../services/financial.service";

import type {
  CreateFeePlanPayload,
  UpdateFeePlanPayload,
} from "../types/payloads.types";

const QUERY_KEY = ["fee-plans"];

export function useFeePlans() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: financialService.getFeePlans,
  });

  const create = useMutation({
    mutationFn: (payload: CreateFeePlanPayload) =>
      financialService.createFeePlan(payload),

    onSuccess: async () => {
    await queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateFeePlanPayload;
    }) =>
      financialService.updateFeePlan(id, payload),

   onSuccess: async () => {
   await queryClient.invalidateQueries({
    queryKey: QUERY_KEY,
  });
},
   onError(error) {
  console.error(error);
}
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      financialService.deleteFeePlan(id),

    onSuccess: async() => {
     await queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  return {
    ...query,

    createFeePlan: create,

    updateFeePlan: update,

    deleteFeePlan: remove,
  };
}
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { financialService } from "../services/financial.service";

import type {
  UpdateExtraServicePayload,
} from "../types/payloads.types";

const QUERY_KEY = ["extra-services"];

export function useExtraServices() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
   queryFn: () =>
    financialService.getFeePlans(),
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateExtraServicePayload;
    }) =>
      financialService.updateExtraService(
        id.toString(),
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      financialService.deleteExtraService(id.toString()),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
    onError(error){
    console.error(error);
}
  });

  return {
    ...query,

    updateExtraService: update,

    deleteExtraService: remove,
  };
}
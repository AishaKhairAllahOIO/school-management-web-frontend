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
    queryFn: financialService.getExtraServices,
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateExtraServicePayload;
    }) =>
      financialService.updateExtraService(
        id,
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      financialService.deleteExtraService(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  return {
    ...query,

    updateExtraService: update,

    deleteExtraService: remove,
  };
}
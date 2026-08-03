import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  toast,
} from "sonner";

import {
  getAxiosErrorMessage,
} from "@/services/axios/axiosError";

import {
  schoolLawsService,
} from "../services/school-laws.service";
import type {
  LawPayload,
} from "../types/school-laws.types";

const lawsKey = ["communications", "school-laws"] as const;

export function useSchoolLaws() {
  const queryClient = useQueryClient();

  const lawsQuery = useQuery({
    queryKey: lawsKey,
    queryFn: schoolLawsService.getAllLaws,
  });

  const createLaw = useMutation({
    mutationFn: (payload: LawPayload) => schoolLawsService.createLaw(payload),
    onSuccess: async () => {
      toast.success("School law created successfully.");
      await queryClient.invalidateQueries({ queryKey: lawsKey });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });

  const updateLaw = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<LawPayload> }) =>
      schoolLawsService.updateLaw(id, payload),
    onSuccess: async () => {
      toast.success("School law updated successfully.");
      await queryClient.invalidateQueries({ queryKey: lawsKey });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });

  const deleteLaw = useMutation({
    mutationFn: (id: string | number) => schoolLawsService.deleteLaw(id),
    onSuccess: async () => {
      toast.success("School law deleted successfully.");
      await queryClient.invalidateQueries({ queryKey: lawsKey });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });

  return {
    laws: lawsQuery.data ?? [],
    isLoading: lawsQuery.isLoading,
    isError: lawsQuery.isError,
    refetch: lawsQuery.refetch,
    createLaw,
    updateLaw,
    deleteLaw,
  };
}

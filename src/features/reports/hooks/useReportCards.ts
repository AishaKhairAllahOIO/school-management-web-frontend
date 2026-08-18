import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAxiosErrorMessage } from "@/services/axios/axiosError";
import { reportCardsApi } from "../api/report-cards.api";
import type { ApiId } from "../../users/shared/types/api.types";

export const reportCardKeys = {
  all: ["report-cards"] as const,
  list: (semesterId?: ApiId, gradeId?: ApiId, classRoomId?: ApiId, page?: number) => 
    [...reportCardKeys.all, "list", { semesterId, gradeId, classRoomId, page }] as const,
};

export function useReportCards(semesterId?: ApiId, gradeId?: ApiId, classRoomId?: ApiId, page: number = 1) {
  return useQuery({
    queryKey: reportCardKeys.list(semesterId, gradeId, classRoomId, page),
    queryFn: () => reportCardsApi.getList(semesterId, gradeId, classRoomId, page),
    enabled: !!semesterId, 
  });
}

export function useGenerateReportCards() {
  return useMutation({
    mutationFn: reportCardsApi.generate,
    onSuccess: (data) => {
      toast.success(data.message || "Background generation process started successfully.");
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error) || "Failed to generate report cards.");
    },
  });
}

export function useTogglePublishReportCards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportCardsApi.togglePublish,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: reportCardKeys.all });
      toast.success(data.message || "Publish status updated successfully.");
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error) || "Failed to update publish status.");
    },
  });
}

export function usePromoteStudents() {
  return useMutation({
    mutationFn: reportCardsApi.promote,
    onSuccess: (data) => {
      const stats = data.data;
      if (stats) {
        toast.success(
          `${data.message} (Promoted: ${stats.promoted_students_count}, Graduated: ${stats.graduated_students_count})`,
          { duration: 6000 }
        );
      } else {
        toast.success(data.message || "Student promotion completed successfully.");
      }
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error) || "An error occurred during student promotion.");
    },
  });
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAxiosErrorMessage } from "@/services/axios/axiosError";
import { reportCardsApi } from "../api/report-cards.api";
import type { ApiId } from "../../users/shared/types/api.types";

export const reportCardKeys = {
  all: ["report-cards"] as const,
  list: (semesterId?: ApiId, classRoomId?: ApiId) => 
    [...reportCardKeys.all, "list", { semesterId, classRoomId }] as const,
};

export function useReportCards(semesterId?: ApiId, classRoomId?: ApiId) {
  return useQuery({
    queryKey: reportCardKeys.list(semesterId, classRoomId),
    queryFn: () => reportCardsApi.getList(semesterId, classRoomId),
    enabled: !!semesterId, 
  });
}

export function useGenerateReportCards() {
  return useMutation({
    mutationFn: reportCardsApi.generate,
    onSuccess: (data) => {
      toast.success(data.message || "تم بدء عملية التوليد في الخلفية.");
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error) || "فشل توليد الجلاءات.");
    },
  });
}

export function useTogglePublishReportCards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportCardsApi.togglePublish,
    onSuccess: async (data, variables) => {
      // تحديث الكاش فوراً للجدول الحالي لتعكس حالة النشر الجديدة
      await queryClient.invalidateQueries({ 
        queryKey: reportCardKeys.list(variables.semester_id, variables.class_room_id) 
      });
      toast.success(data.message || "تم تعديل حالة النشر بنجاح.");
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error) || "فشل تعديل حالة النشر.");
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
          `${data.message} (تم ترفيع: ${stats.promoted_students_count}، تخرج: ${stats.graduated_students_count})`,
          { duration: 6000 } // رسالة أطول قليلاً ليقرأ الإحصائيات
        );
      } else {
        toast.success(data.message || "تم تنفيذ عملية الترفيع بنجاح.");
      }
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error) || "حدث خطأ فادح أثناء عملية الترفيع.");
    },
  });
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communicationService } from "../services/communications.service";
import type { ActivityPayload } from "../types/communication.types";

const extractArray = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  return [];
};

export function useActivities() {
  const queryClient = useQueryClient();

  const activitiesQuery = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      try {
        const response = await communicationService.getAllActivities();
        return extractArray(response);
      } catch (error: any) {
        if (error?.response?.status === 403) {
          console.warn("⚠️ السيرفر يحظر جلب الأنشطة لهذا الحساب (403).");
          return []; // إرجاع مصفوفة فارغة لتجنب انهيار الواجهة
        }
        throw error;
      }
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: (payload: ActivityPayload) => communicationService.createActivity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<ActivityPayload> }) =>
      communicationService.updateActivity(id, payload), // يستخدم POST حسب البوستمان
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (id: string | number) => communicationService.deleteActivity(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["activities"], (oldData: any[] = []) =>
        oldData.filter((item) => item.id !== deletedId)
      );
    },
  });

  return {
    activities: activitiesQuery.data ?? [],
    isLoading: activitiesQuery.isLoading,
    createActivity: createActivityMutation,
    updateActivity: updateActivityMutation,
    deleteActivity: deleteActivityMutation,
  };
}
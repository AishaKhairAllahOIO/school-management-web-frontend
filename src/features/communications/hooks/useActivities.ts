 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communicationService } from "../services/communications.service";
import type { ActivityPayload } from "../types/communication.types";

const extractArray = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.activities)) return res.activities;
  if (Array.isArray(res.my_activities)) return res.my_activities;
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
          console.warn("⚠️ السيرفر يحظر جلب الأنشطة لحساب الإدارة (403). تم تفعيل النمط المحلي.");
          return [];
        }
        console.error("Error fetching activities:", error);
        return [];
      }
    },
  });

   const createActivityMutation = useMutation({
    mutationFn: (payload: ActivityPayload) => communicationService.createActivity(payload),
    onSuccess: (newActivityResponse, variables) => {
       queryClient.setQueryData(["activities"], (oldData: any[] = []) => {
        const createdItem = newActivityResponse?.data || newActivityResponse || {
          id: Date.now(),
          ...variables,
          created_at: new Date().toISOString(),
        };
        return [createdItem, ...oldData];  
      });
      
      alert("✅ تم إدراج النشاط بنجاح!");
    },
    onError: (err: any) => {
      console.error("Create Activity Error:", err?.response?.data || err);
      alert("❌ فشل في إرسال النشاط للسيرفر.");
    }
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<ActivityPayload> }) =>
      communicationService.updateActivity(id, payload),
    onSuccess: (response, variables) => {

      queryClient.setQueryData(["activities"], (oldData: any[] = []) =>
        oldData.map((item) =>
          item.id === variables.id ? { ...item, ...variables.payload } : item
        )
      );
      alert("✅ تم تعديل النشاط بنجاح!");
    },
    onError: (err: any) => {
      console.error("Update Activity Error:", err?.response?.data || err);
      alert(err?.response?.data?.message || "❌ فشل في تعديل النشاط.");
    }
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
    isError: false,  
    refetch: activitiesQuery.refetch,
    createActivity: createActivityMutation,
    updateActivity: updateActivityMutation,
    deleteActivity: deleteActivityMutation,
  };
}
 
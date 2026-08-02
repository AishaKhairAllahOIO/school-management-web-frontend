import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communicationService } from "../services/communications.service";
import type { AnnouncementPayload } from "../types/communication.types";


const extractArray = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  if (res.data && res.data.data && Array.isArray(res.data.data.data)) return res.data.data.data;
  if (Array.isArray(res.announcements)) return res.announcements;
  if (res.data && Array.isArray(res.data.announcements)) return res.data.announcements;
  if (res.data && res.data.announcements && Array.isArray(res.data.announcements.data)) return res.data.announcements.data;
  return [];
};

export function useAnnouncements() {
  const queryClient = useQueryClient();


  const myAnnouncementsQuery = useQuery({
    queryKey: ["announcements", "created"],
    queryFn: async () => {
      try {
        const response = await communicationService.getCreatedAnnouncements();
        console.log("📢 استجابة إعلاناتي من لارافيل:", response);
        return extractArray(response);
      } catch (error) {
        console.error("Error fetching created announcements:", error);
        return [];
      }
    },
  });


  const staffAnnouncementsQuery = useQuery({
    queryKey: ["announcements", "staff"],
    queryFn: async () => {
      try {
        const response = await communicationService.getStaffAnnouncements();
        return extractArray(response);
      } catch (error) {
        console.error("Error fetching staff announcements:", error);
        return [];
      }
    },
  });


  const createAnnouncementMutation = useMutation({
    mutationFn: (payload: AnnouncementPayload) => communicationService.createAnnouncement(payload),
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.refetchQueries({ queryKey: ["announcements"] });
    },
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<AnnouncementPayload> }) =>
      communicationService.updateAnnouncement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string | number) => communicationService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });

  return {
    myAnnouncements: myAnnouncementsQuery.data ?? [],
    staffAnnouncements: staffAnnouncementsQuery.data ?? [],
    isLoadingMy: myAnnouncementsQuery.isLoading,
    isLoadingStaff: staffAnnouncementsQuery.isLoading,
    createAnnouncement: createAnnouncementMutation,
    updateAnnouncement: updateAnnouncementMutation,
    deleteAnnouncement: deleteAnnouncementMutation,
  };
}
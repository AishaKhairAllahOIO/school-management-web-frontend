import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communicationService } from "../services/communications.service";
import type { AnnouncementPayload } from "../types/communication.types";

export function useAnnouncements() {
  const queryClient = useQueryClient();


  const myAnnouncementsQuery = useQuery({
    queryKey: ["announcements", "created"],
    queryFn: () => communicationService.getCreatedAnnouncements(),
  });


  const staffAnnouncementsQuery = useQuery({
    queryKey: ["announcements", "staff"],
    queryFn: () => communicationService.getStaffAnnouncements(),
  });


  const createAnnouncementMutation = useMutation({
    mutationFn: (payload: AnnouncementPayload) => communicationService.createAnnouncement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
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
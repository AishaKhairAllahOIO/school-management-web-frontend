import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { communicationService } from "../services/communications.service";
import type { AnnouncementPayload } from "../types/communication.types";

const announcementKeys = {
  all: ["communications", "announcements"] as const,
  created: ["communications", "announcements", "created"] as const,
};

function extractArray(response: unknown): any[] {
  const value = response as any;
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.data)) return value.data;
  if (Array.isArray(value.data?.data)) return value.data.data;
  return [];
}

export function useAnnouncements() {
  const queryClient = useQueryClient();

  const myAnnouncementsQuery = useQuery({
    queryKey: announcementKeys.created,
    queryFn: async () =>
      extractArray(
        await communicationService.getCreatedAnnouncements(),
      ),
  });

  const createAnnouncement = useMutation({
    mutationFn: (payload: AnnouncementPayload) =>
      communicationService.createAnnouncement(payload),
    onSuccess: async () => {
      toast.success("Announcement published successfully.");
      await queryClient.invalidateQueries({
        queryKey: announcementKeys.all,
      });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });

  const updateAnnouncement = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: Partial<AnnouncementPayload>;
    }) => communicationService.updateAnnouncement(id, payload),
    onSuccess: async () => {
      toast.success("Announcement updated successfully.");
      await queryClient.invalidateQueries({
        queryKey: announcementKeys.all,
      });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });

  const deleteAnnouncement = useMutation({
    mutationFn: (id: string | number) =>
      communicationService.deleteAnnouncement(id),
    onSuccess: async () => {
      toast.success("Announcement deleted successfully.");
      await queryClient.invalidateQueries({
        queryKey: announcementKeys.all,
      });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });

  return {
    myAnnouncements: myAnnouncementsQuery.data ?? [],
    isLoadingMy: myAnnouncementsQuery.isLoading,
    isErrorMy: myAnnouncementsQuery.isError,
    refetchMy: myAnnouncementsQuery.refetch,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
}

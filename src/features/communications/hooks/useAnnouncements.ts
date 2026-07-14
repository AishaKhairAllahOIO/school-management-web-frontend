import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { communicationsService } from "../services/communications.service";
import type { CreateAnnouncementPayload, Announcement } from "../types/announcement.types";

const QUERY_KEY = ["communications", "announcements"];

export function useAnnouncements() {
  const queryClient = useQueryClient();

  const announcementsQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => communicationsService.getUserAnnouncements(),
  });

  const createAnnouncement = useMutation({
    mutationFn: async (payload: CreateAnnouncementPayload) =>
      communicationsService.createAnnouncement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    ...announcementsQuery,
    createAnnouncement,
  };
}

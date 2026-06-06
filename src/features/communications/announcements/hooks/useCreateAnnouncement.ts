import { useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementService } from "../api";
import type { CreateAnnouncementPayload } from "../api";

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementPayload) =>
      announcementService.createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

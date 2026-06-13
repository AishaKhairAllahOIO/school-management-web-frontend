import { useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementService } from "../api";
import type { UpdateAnnouncementPayload } from "../api";

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAnnouncementPayload;
    }) => announcementService.updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

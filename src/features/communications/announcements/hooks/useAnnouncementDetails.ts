import { useQuery } from "@tanstack/react-query";
import { announcementService } from "../api";

export function useAnnouncementDetails(id: string | null) {
  return useQuery({
    queryKey: ["announcement", id],
    queryFn: () => announcementService.getAnnouncement(id!),
    enabled: !!id,
  });
}

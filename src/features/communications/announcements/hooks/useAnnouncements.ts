import { useQuery }
from "@tanstack/react-query";

import {
  announcementsMock,
}
from "../mocks/announcements.mock";

export const useAnnouncements =
() => {
  return useQuery({
    queryKey: [
      "announcements",
    ],

    queryFn: async () => {
      return announcementsMock;
    },
  });
};
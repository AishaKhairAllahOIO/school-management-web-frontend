import { useQuery } from "@tanstack/react-query";

import { complaintsMock } from "../mocks/complaints.mock";

export const useComplaints = () => {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
      return complaintsMock;
    },
  });
};

import { useQuery }
from "@tanstack/react-query";

import {
  leaveRequestsMock,
}
from "../mocks/staffLeaves.mock";

export const useLeaveRequests =
() => {
  return useQuery({
    queryKey: [
      "leave-requests",
    ],

    queryFn: async () => {
      return leaveRequestsMock;
    },
  });
};
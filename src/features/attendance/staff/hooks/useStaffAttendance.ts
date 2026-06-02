import { useQuery }
from "@tanstack/react-query";

import {
  staffAttendanceMock,
}
from "../mocks/staffAttendance.mock";

export const useStaffAttendance =
() => {
  return useQuery({
    queryKey: [
      "staff-attendance",
    ],

    queryFn: async () =>
      staffAttendanceMock,
  });
};
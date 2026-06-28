import { useQuery }
from "@tanstack/react-query";

import {
  payrollHistoryMock,
}
from "../mocks/payrollHistory.mock";

export const usePayrollHistory =
() => {
  return useQuery({
    queryKey: [
      "payroll-history",
    ],

    queryFn: async () => {
      return payrollHistoryMock;
    },
  });
};
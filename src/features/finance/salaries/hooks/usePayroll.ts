import { useQuery } from "@tanstack/react-query";

import {
  payrollMock,
} from "../mocks/salaries.mock";

export const usePayroll = () => {
  return useQuery({
    queryKey: ["payroll"],

    queryFn: async () => {
      return payrollMock;
    },
  });
};
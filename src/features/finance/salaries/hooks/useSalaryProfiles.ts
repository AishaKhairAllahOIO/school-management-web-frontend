import { useQuery } from "@tanstack/react-query";

import {
  salaryProfilesMock,
} from   "../mocks/salaries.mock";

export const useSalaryProfiles = () => {
  return useQuery({
    queryKey: ["salary-profiles"],

    queryFn: async () => {
      return salaryProfilesMock;
    },
  });
};
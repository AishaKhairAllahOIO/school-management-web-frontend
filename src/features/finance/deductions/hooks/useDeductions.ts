import { useQuery }
from "@tanstack/react-query";

import {
  deductionsMock,
} from  "../mocks/deductions.mock";

export const useDeductions =
() => {
  return useQuery({
    queryKey: [
      "deductions",
    ],

    queryFn: async () => {
      return deductionsMock;
    },
  });
};
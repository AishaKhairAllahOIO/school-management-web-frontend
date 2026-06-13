import { useQuery } from "@tanstack/react-query";

import { financeData } from "../mocks/finance.mock";

export const useFinance = () => {
  return useQuery({
    queryKey: ["finance-data"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
      return financeData;
    },
  });
};

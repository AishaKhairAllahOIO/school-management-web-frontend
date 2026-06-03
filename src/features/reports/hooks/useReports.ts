import { useQuery } from "@tanstack/react-query";

import { fetchReports } from "../api/reports.api";

export const useReports = () => {
  return useQuery({
    queryKey: ["reports-summary"],
    queryFn: fetchReports,
  });
};

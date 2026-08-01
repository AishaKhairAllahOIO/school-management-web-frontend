import { useMutation, useQuery } from "@tanstack/react-query";

import { fetchReports, generateReport } from "../api/reports.api";

export function useReports() {
  return useQuery({
    queryKey: ["reports", "workspace"],
    queryFn: fetchReports,
    staleTime: 60_000,
  });
}

export function useGenerateReport() {
  return useMutation({
    mutationFn: generateReport,
  });
}

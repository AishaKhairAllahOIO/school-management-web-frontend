import { useQuery } from "@tanstack/react-query";

import { getSchedulingCatalog } from "@/features/scheduling/catalog/api/scheduling-catalog.api";

export const schedulingCatalogQueryKey = ["scheduling", "catalog"];

export function useSchedulingCatalog() {
  return useQuery({
    queryKey: schedulingCatalogQueryKey,
    queryFn: getSchedulingCatalog,
    staleTime: 5 * 60 * 1000,
  });
}

import { useQuery } from "@tanstack/react-query";

import { financeOperationsService } from "../services/finance-operations.service";
import { installmentsQueryKey } from "./usePayments";

export function useInstallments() {
  return useQuery({
    queryKey: installmentsQueryKey,
    queryFn: financeOperationsService.getAllInstallments,
  });
}

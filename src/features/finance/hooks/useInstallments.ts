import { useQuery } from "@tanstack/react-query";
import { financeOperationsService } from "../services/finance-operations.service";

export function useInstallments() {
  const installmentsQuery = useQuery({
    queryKey: ["installments-list"],
    queryFn: financeOperationsService.getAllInstallments,
  });

  return { ...installmentsQuery };
}
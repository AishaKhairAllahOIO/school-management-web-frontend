import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAxiosErrorMessage } from "@/services/axios/axiosError";
import type { ApiId } from "../../shared/types/api.types";
import { staffApi } from "../api/staff.api";
import type { StaffImportBatchStatusValue, StaffImportStartResponse } from "../types/staff.types";
import { staffKeys } from "./staff.keys";

const FINAL_STATUSES: StaffImportBatchStatusValue[] = ["completed", "failed"];

export function getStaffImportBatchId(response: StaffImportStartResponse): ApiId {
  const id = response.batchId ?? response.batch_id;
  if (id === undefined || id === null) {
    throw new Error("The server did not return an import batch ID.");
  }
  return id;
}

export function useImportStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => staffApi.importFile(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: staffKeys.all });
      toast.success("The file was uploaded and staff processing has started.");
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });
}

export function useStaffImportStatus(batchId: ApiId | null | undefined) {
  return useQuery({
    queryKey: staffKeys.importStatus(batchId ?? "disabled"),
    queryFn: () => staffApi.getImportStatus(batchId!),
    enabled: batchId !== null && batchId !== undefined,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && FINAL_STATUSES.includes(status) ? false : 2500;
    },
  });
}

export function useDownloadStaffImportErrors() {
  return useMutation({
    mutationFn: async ({ batchId, fileName = "staff-import-errors.xlsx" }: { batchId: ApiId; fileName?: string }) => {
      const blob = await staffApi.exportImportErrors(batchId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    },
    onSuccess: () => toast.success("The import error file was downloaded."),
    onError: (error) => toast.error(getAxiosErrorMessage(error)),
  });
}

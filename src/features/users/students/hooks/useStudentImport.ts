import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";
import type { ApiId } from "../../shared/types/api.types";
import { studentApi } from "../api/student.api";
import type {
  StudentImportBatchStatusValue,
  StudentImportStartResponse,
} from "../types/student.types";
import { studentKeys } from "./student.keys";

const FINAL_IMPORT_STATUSES: StudentImportBatchStatusValue[] = [
  "completed",
  "failed",
];

export function getStudentImportBatchId(
  response: StudentImportStartResponse,
): ApiId {
  const batchId = response.batchId ?? response.batch_id;

  if (batchId === undefined || batchId === null) {
    throw new Error("The server did not return an import batch ID.");
  }

  return batchId;
}

export function useImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => studentApi.importFile(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentKeys.imports(),
      });

      toast.success(
        "The file was uploaded and student processing has started.",
      );
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

export function useStudentImportStatus(
  batchId: ApiId | null | undefined,
) {
  return useQuery({
    queryKey: studentKeys.importStatus(batchId ?? "disabled"),
    queryFn: () => studentApi.getImportStatus(batchId!),
    enabled: batchId !== null && batchId !== undefined,
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (status && FINAL_IMPORT_STATUSES.includes(status)) {
        return false;
      }

      return 2_500;
    },
  });
}

export function useStudentImportHistory(page = 1) {
  return useQuery({
    queryKey: studentKeys.importHistory(page),
    queryFn: () => studentApi.getImportHistory(page),
    placeholderData: (previousData) => previousData,
  });
}

export function useDownloadStudentImportErrors() {
  return useMutation({
    mutationFn: async ({
      batchId,
      fileName = "student-import-errors.xlsx",
    }: {
      batchId: ApiId;
      fileName?: string;
    }) => {
      const blob = await studentApi.exportImportErrors(batchId);
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    },
    onSuccess: () => {
      toast.success("The import error file was downloaded.");
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}

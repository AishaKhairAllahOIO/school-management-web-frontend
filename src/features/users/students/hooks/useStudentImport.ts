import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { studentApi } from "../api/student.api";
import type {
  EntityId,
  StudentImportResponse,
} from "../types/student-api.types";
import { studentKeys } from "./student.keys";

function getBatchId(
  response: StudentImportResponse,
): EntityId {
  const batchId =
    response.batchId ??
    response.batch_id ??
    response.id;

  if (batchId === undefined) {
    throw new Error(
      "لم يُرجع الخادم رقم عملية الاستيراد.",
    );
  }

  return batchId;
}

export function useImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      studentApi.importExcel(file),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          studentKeys.importHistory(),
      });

      toast.success(
        "تم استلام الملف وبدأت معالجته.",
      );
    },

    onError: (error) =>
      toast.error(
        getAxiosErrorMessage(error),
      ),
  });
}

export function useStudentImportStatus(
  batchId: EntityId | null,
) {
  return useQuery({
    queryKey: studentKeys.importStatus(
      batchId ?? "disabled",
    ),
    queryFn: () =>
      studentApi.getImportStatus(batchId!),
    enabled: batchId !== null,

    refetchInterval: (query) => {
      const status =
        query.state.data?.status;

      if (
        status === "completed" ||
        status === "failed"
      ) {
        return false;
      }

      return 2_500;
    },
  });
}

export function useStudentImportHistory() {
  return useQuery({
    queryKey: studentKeys.importHistory(),
    queryFn: () =>
      studentApi.getImportHistory(),
  });
}

export function useDownloadImportErrors() {
  return useMutation({
    mutationFn: async ({
      batchId,
      fileName = "student-import-errors.xlsx",
    }: {
      batchId: EntityId;
      fileName?: string;
    }) => {
      const blob =
        await studentApi.downloadImportErrors(
          batchId,
        );

      const url =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
    },

    onError: (error) =>
      toast.error(
        getAxiosErrorMessage(error),
      ),
  });
}

export { getBatchId };

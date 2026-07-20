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
  ImportBatchStatus,
} from "../types/student.types";

import { studentKeys } from "./student.keys";

type ImportResponse = {
  batch_id?: EntityId;
  batchId?: EntityId;
  id?: EntityId;
};

function getBatchId(
  response: ImportResponse,
): EntityId {
  const batchId =
    response.batchId ??
    response.batch_id ??
    response.id;

  if (
    batchId === undefined ||
    batchId === null
  ) {
    throw new Error(
      "لم يُرجع الخادم رقم عملية الاستيراد.",
    );
  }

  return batchId;
}

function isImportFinished(
  status: ImportBatchStatus["status"] | undefined,
): boolean {
  return (
    status === "completed" ||
    status === "failed"
  );
}

export function useImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      file: File,
    ) => studentApi.importFile(file),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          studentKeys.importHistory(),
      });

      toast.success(
        "تم استلام الملف وبدأت معالجته.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export function useStudentImportStatus(
  batchId: EntityId | null | undefined,
) {
  return useQuery({
    queryKey: studentKeys.importStatus(
      batchId ?? "disabled",
    ),

    queryFn: () =>
      studentApi.getImportStatus(batchId!),

    enabled:
      batchId !== null &&
      batchId !== undefined &&
      batchId !== "",

    refetchInterval: (query) => {
      const status =
        query.state.data?.status;

      if (isImportFinished(status)) {
        return false;
      }

      return 2_500;
    },

    refetchIntervalInBackground: true,
  });
}

export function useStudentImportHistory() {
  return useQuery({
    queryKey:
      studentKeys.importHistory(),

    queryFn: () =>
      studentApi.getImportHistory(),

    staleTime: 30_000,
  });
}

export function useDownloadImportErrors() {
  return useMutation({
    mutationFn: async ({
      batchId,
      fileName =
        "student-import-errors.xlsx",
    }: {
      batchId: EntityId;
      fileName?: string;
    }) => {
      const blob =
        await studentApi.downloadImportErrors(
          batchId,
        );

      const objectUrl =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = fileName;

      document.body.appendChild(anchor);

      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(objectUrl);
    },

    onSuccess: () => {
      toast.success(
        "تم تنزيل ملف الأخطاء بنجاح.",
      );
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}

export {
  getBatchId,
  isImportFinished,
};
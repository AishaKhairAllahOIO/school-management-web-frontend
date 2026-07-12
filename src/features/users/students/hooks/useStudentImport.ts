import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAxiosErrorMessage } from "@/services/axios/axiosError";

import { studentApi } from "../api/student.api";
import { studentsQueryKey } from "./useStudents";

export const studentImportQueryKey = [
  "users",
  "students",
  "import",
] as const;

export function useImportStudents() {
  return useMutation({
    mutationFn: (file: File) =>
      studentApi.importExcel(file),

    onSuccess: () => {
      toast.success(
        "The file was received and is being processed.",
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
  batchId: number | null,
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [
      ...studentImportQueryKey,
      batchId,
    ],

    queryFn: () =>
      studentApi.getImportStatus(batchId!),

    enabled: batchId !== null,

    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (
        status === "completed" ||
        status === "failed"
      ) {
        void queryClient.invalidateQueries({
          queryKey: studentsQueryKey,
        });

        return false;
      }

      return 2000;
    },
  });
}

export function useDownloadStudentImportErrors() {
  return useMutation({
    mutationFn: async (
      batchId: number | string,
    ) => {
      const blob =
        await studentApi.downloadImportErrors(
          batchId,
        );

      const objectUrl =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = objectUrl;
      anchor.download =
        `student-import-errors-${batchId}.xlsx`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(objectUrl);
    },

    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });
}
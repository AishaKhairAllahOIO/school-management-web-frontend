import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  getBatchId,
  useDownloadImportErrors,
  useImportStudents,
  useStudentImportStatus,
} from "../hooks/useStudentImport";

import type {
  EntityId,
  StudentImportBatchStatus,
} from "../types/student-api.types";

type StudentImportPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function StudentImportPanel({
  open,
  onClose,
}: StudentImportPanelProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [batchId, setBatchId] =
    useState<EntityId | null>(null);

  const importMutation =
    useImportStudents();

  const importStatusQuery =
    useStudentImportStatus(batchId);

  const downloadErrorsMutation =
    useDownloadImportErrors();

  const status = importStatusQuery.data;

  const totalRows = getStatusNumber(
    status,
    "totalRows",
    "total_rows",
  );

  const processedRows = getStatusNumber(
    status,
    "processedRows",
    "processed_rows",
  );

  const successfulRows = getStatusNumber(
    status,
    "successfulRows",
    "successful_rows",
  );

  const failedRows = getStatusNumber(
    status,
    "failedRows",
    "failed_rows",
  );

  const progress =
    totalRows > 0
      ? Math.min(
          100,
          Math.round(
            (processedRows / totalRows) * 100,
          ),
        )
      : 0;

  const isTerminal =
    status?.status === "completed" ||
    status?.status === "failed";

  const isProcessing =
    batchId !== null && !isTerminal;

  const isCloseDisabled =
    importMutation.isPending || isProcessing;

  if (!open) {
    return null;
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const isSupported =
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".csv");

    if (!isSupported) {
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setBatchId(null);
  }

  function handleUpload() {
    if (
      !selectedFile ||
      importMutation.isPending
    ) {
      return;
    }

    importMutation.mutate(selectedFile, {
      onSuccess: (response) => {
        setBatchId(getBatchId(response));
      },
    });
  }

  function handleDownloadErrors() {
    if (batchId === null) {
      return;
    }

    downloadErrorsMutation.mutate({
      batchId,
      fileName: `student-import-errors-${batchId}.xlsx`,
    });
  }

  function handleClose() {
    if (isCloseDisabled) {
      return;
    }

    resetPanel();
    onClose();
  }

  function resetPanel() {
    setSelectedFile(null);
    setBatchId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    importMutation.reset();
    downloadErrorsMutation.reset();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-import-title"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2
              id="student-import-title"
              className="text-xl font-bold text-foreground"
            >
              Import Students
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload an Excel or CSV file and
              monitor the import process.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close import panel"
            onClick={handleClose}
            disabled={isCloseDisabled}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <button
            type="button"
            disabled={
              importMutation.isPending ||
              batchId !== null
            }
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center transition hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FileSpreadsheet
              size={42}
              className="text-primary"
            />

            <div>
              <p className="break-all text-sm font-bold text-foreground">
                {selectedFile
                  ? selectedFile.name
                  : "Choose a spreadsheet file"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Supported file types: .xlsx and
                .csv
              </p>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={handleFileChange}
          />

          {importMutation.isError ? (
            <StatusMessage
              variant="error"
              message="The file could not be uploaded. Please check the file and try again."
            />
          ) : null}

          {batchId === null ? (
            <button
              type="button"
              disabled={
                !selectedFile ||
                importMutation.isPending
              }
              onClick={handleUpload}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {importMutation.isPending ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Upload size={17} />
              )}

              {importMutation.isPending
                ? "Uploading..."
                : "Upload and Process"}
            </button>
          ) : null}

          {batchId !== null ? (
            <section className="rounded-2xl border border-border bg-muted/20 p-5">
              <div className="flex items-center gap-3">
                <ImportStatusIcon
                  status={status?.status}
                  isError={
                    importStatusQuery.isError
                  }
                />

                <div className="min-w-0">
                  <p className="text-sm font-bold capitalize text-foreground">
                    {getStatusLabel({
                      status: status?.status,
                      isLoading:
                        importStatusQuery.isLoading,
                      isError:
                        importStatusQuery.isError,
                    })}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Batch #{batchId}
                  </p>
                </div>
              </div>

              <div
                className="mt-5 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Import progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  style={{
                    width: `${progress}%`,
                  }}
                  className="h-full rounded-full bg-primary transition-all duration-300"
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {processedRows} of {totalRows}
                </span>

                <span>{progress}%</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <Metric
                  label="Total"
                  value={totalRows}
                />

                <Metric
                  label="Processed"
                  value={processedRows}
                />

                <Metric
                  label="Successful"
                  value={successfulRows}
                />

                <Metric
                  label="Failed"
                  value={failedRows}
                />
              </div>

              {importStatusQuery.isError ? (
                <div className="mt-5">
                  <StatusMessage
                    variant="error"
                    message="The import status could not be retrieved."
                  />
                </div>
              ) : null}

              {isTerminal &&
              failedRows === 0 &&
              !importStatusQuery.isError ? (
                <div className="mt-5">
                  <StatusMessage
                    variant="success"
                    message="The student import was completed successfully."
                  />
                </div>
              ) : null}

              {failedRows > 0 ? (
                <button
                  type="button"
                  disabled={
                    downloadErrorsMutation.isPending
                  }
                  onClick={handleDownloadErrors}
                  className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 text-xs font-bold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {downloadErrorsMutation.isPending ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Download size={15} />
                  )}

                  {downloadErrorsMutation.isPending
                    ? "Downloading..."
                    : "Download Import Errors"}
                </button>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function getStatusNumber(
  status: StudentImportBatchStatus | undefined,
  camelCaseKey:
    | "totalRows"
    | "processedRows"
    | "successfulRows"
    | "failedRows",
  snakeCaseKey:
    | "total_rows"
    | "processed_rows"
    | "successful_rows"
    | "failed_rows",
): number {
  const value =
    status?.[camelCaseKey] ??
    status?.[snakeCaseKey] ??
    0;

  return Number(value);
}

function getStatusLabel({
  status,
  isLoading,
  isError,
}: {
  status?: StudentImportBatchStatus["status"];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isError) {
    return "Status check failed";
  }

  if (isLoading) {
    return "Checking import status";
  }

  switch (status) {
    case "pending":
      return "Waiting for processing";

    case "processing":
      return "Processing students";

    case "completed":
      return "Import completed";

    case "failed":
      return "Import failed";

    default:
      return "Waiting for worker";
  }
}

function ImportStatusIcon({
  status,
  isError,
}: {
  status?: StudentImportBatchStatus["status"];
  isError: boolean;
}) {
  if (isError || status === "failed") {
    return (
      <AlertCircle
        size={22}
        className="shrink-0 text-destructive"
      />
    );
  }

  if (status === "completed") {
    return (
      <CheckCircle2
        size={22}
        className="shrink-0 text-success"
      />
    );
  }

  return (
    <Loader2
      size={22}
      className="shrink-0 animate-spin text-primary"
    />
  );
}

function StatusMessage({
  variant,
  message,
}: {
  variant: "success" | "error";
  message: string;
}) {
  const isSuccess = variant === "success";

  return (
    <div
      className={
        isSuccess
          ? "flex items-start gap-2 rounded-xl border border-success/20 bg-success/10 p-3 text-xs text-success"
          : "flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
      }
    >
      {isSuccess ? (
        <CheckCircle2
          size={16}
          className="mt-0.5 shrink-0"
        />
      ) : (
        <AlertCircle
          size={16}
          className="mt-0.5 shrink-0"
        />
      )}

      <p>{message}</p>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="font-bold text-foreground">
        {value}
      </p>

      <p className="mt-1 text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
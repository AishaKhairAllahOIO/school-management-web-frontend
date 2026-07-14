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
  useDownloadStudentImportErrors,
  useImportStudents,
  useStudentImportStatus,
} from "../hooks/useStudentImport";

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
    useState<number | null>(null);

  const importMutation =
    useImportStudents();

  const importStatusQuery =
    useStudentImportStatus(batchId);

  const downloadErrorsMutation =
    useDownloadStudentImportErrors();

  if (!open) {
    return null;
  }

  const status = importStatusQuery.data;

  const progress =
    status && status.total_rows > 0
      ? Math.round(
          (status.processed_rows /
            status.total_rows) *
            100,
        )
      : 0;

  const isTerminal =
    status?.status === "completed" ||
    status?.status === "failed";

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setBatchId(null);
  }

  function handleUpload() {
    if (!selectedFile) {
      return;
    }

    importMutation.mutate(selectedFile, {
      onSuccess: (response) => {
        setBatchId(response.batch_id);
      },
    });
  }

  function handleClose() {
    if (
      importMutation.isPending ||
      (batchId !== null && !isTerminal)
    ) {
      return;
    }

    setSelectedFile(null);
    setBatchId(null);

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Import Students
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload an Excel file and monitor
              background processing.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            disabled={
              importMutation.isPending ||
              (batchId !== null &&
                !isTerminal)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted disabled:opacity-40"
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
              <p className="text-sm font-bold text-foreground">
                {selectedFile
                  ? selectedFile.name
                  : "Choose an Excel file"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Supported file types: .xlsx and
                .xls
              </p>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />

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
                {status?.status ===
                "completed" ? (
                  <CheckCircle2
                    size={22}
                    className="text-success"
                  />
                ) : status?.status ===
                  "failed" ? (
                  <AlertCircle
                    size={22}
                    className="text-destructive"
                  />
                ) : (
                  <Loader2
                    size={22}
                    className="animate-spin text-primary"
                  />
                )}

                <div>
                  <p className="text-sm font-bold text-foreground">
                    {status?.status ??
                      "Waiting for worker"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Batch #{batchId}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  style={{
                    width: `${progress}%`,
                  }}
                  className="h-full rounded-full bg-primary transition-all"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <Metric
                  label="Total"
                  value={status?.total_rows ?? 0}
                />

                <Metric
                  label="Processed"
                  value={
                    status?.processed_rows ?? 0
                  }
                />

                <Metric
                  label="Successful"
                  value={
                    status?.successful_rows ?? 0
                  }
                />

                <Metric
                  label="Failed"
                  value={
                    status?.failed_rows ?? 0
                  }
                />
              </div>

              {status?.has_errors ? (
                <button
                  type="button"
                  disabled={
                    downloadErrorsMutation.isPending
                  }
                  onClick={() =>
                    downloadErrorsMutation.mutate(
                      batchId,
                    )
                  }
                  className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 text-xs font-bold text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
                >
                  <Download size={15} />

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
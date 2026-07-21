import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Download,
  FileSpreadsheet,
  History,
  LoaderCircle,
  RefreshCw,
  UploadCloud,
  XCircle,
} from "lucide-react";

import { StudentPageHeader } from "../components/shared/StudentPageHeader";
import {
  getStudentImportBatchId,
  useDownloadStudentImportErrors,
  useImportStudents,
  useStudentImportHistory,
  useStudentImportStatus,
} from "../hooks/useStudentImport";
import type { ApiId } from "../../shared/types/api.types";
import type {
  StudentImportBatchStatusValue,
} from "../types/student.types";

const ACCEPTED_FILE_TYPES = ".xlsx,.xls,.csv";

function statusLabel(status?: StudentImportBatchStatusValue) {
  switch (status) {
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return "Waiting";
  }
}

function statusIcon(status?: StudentImportBatchStatusValue) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5" />;
    case "failed":
      return <XCircle className="h-5 w-5" />;
    case "processing":
      return <LoaderCircle className="h-5 w-5 animate-spin" />;
    default:
      return <Clock3 className="h-5 w-5" />;
  }
}

export function StudentImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [batchId, setBatchId] = useState<ApiId | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(1);

  const importMutation = useImportStudents();
  const statusQuery = useStudentImportStatus(batchId);
  const historyQuery = useStudentImportHistory(historyPage);
  const downloadErrors = useDownloadStudentImportErrors();

  async function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setSelectedFileName(file.name);

    try {
      const response = await importMutation.mutateAsync(file);
      setBatchId(getStudentImportBatchId(response));
    } catch {
      setSelectedFileName(null);
    }
  }

  const status = statusQuery.data;
  const processedRows = status?.processedRows ?? status?.processed_rows ?? 0;
  const successfulRows = status?.successfulRows ?? status?.successful_rows ?? 0;
  const failedRows = status?.failedRows ?? status?.failed_rows ?? 0;
  const totalRows = status?.totalRows ?? status?.total_rows ?? processedRows;
  const history = historyQuery.data?.data ?? [];
  const meta = historyQuery.data?.meta;

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1450px] flex-col gap-6">
        <StudentPageHeader
          title="Import students"
          description="Upload an Excel or CSV file and follow the processing result for every row."
          showBackButton
          icon={<FileSpreadsheet className="h-7 w-7" />}
        />

        <section className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <article className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-[var(--shadow-card)]">
            <header className="border-b border-border/70 bg-secondary/35 px-6 py-5">
              <h2 className="text-lg font-black">Upload student records</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
                Supported file types: XLSX, XLS, and CSV. The column names must
                match the backend template exactly.
              </p>
            </header>

            <div className="p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                onChange={selectFile}
                className="sr-only"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={importMutation.isPending}
                className="group flex min-h-64 w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-primary/25 bg-primary/5 px-6 text-center transition hover:border-primary/45 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-primary/10 text-primary transition group-hover:scale-105">
                  {importMutation.isPending ? (
                    <LoaderCircle className="h-9 w-9 animate-spin" />
                  ) : (
                    <UploadCloud className="h-9 w-9" />
                  )}
                </span>
                <span className="mt-5 text-lg font-black">
                  {importMutation.isPending ? "Uploading file..." : "Choose import file"}
                </span>
                <span className="mt-2 max-w-md text-sm font-medium leading-6 text-muted-foreground">
                  Academic year, grade, and classroom are submitted by name, not by ID.
                </span>
              </button>

              {selectedFileName ? (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-4">
                  <FileSpreadsheet className="h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Selected file
                    </p>
                    <p className="truncate text-sm font-black">{selectedFileName}</p>
                  </div>
                </div>
              ) : null}

              <div className="mt-5 rounded-2xl border border-warning/25 bg-warning/10 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                  <p className="text-sm font-semibold leading-6">
                    Leave <code>class_room_name</code> empty when the classroom is
                    unknown. The backend accepts an enrollment without a classroom.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-[var(--shadow-card)]">
            <header className="flex items-center justify-between border-b border-border/70 bg-secondary/35 px-6 py-5">
              <div>
                <h2 className="text-lg font-black">Current batch</h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Live status of the latest uploaded file.
                </p>
              </div>
              {batchId ? (
                <button
                  type="button"
                  onClick={() => void statusQuery.refetch()}
                  disabled={statusQuery.isFetching}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground hover:text-primary disabled:opacity-50"
                  aria-label="Refresh import status"
                >
                  <RefreshCw className={`h-4 w-4 ${statusQuery.isFetching ? "animate-spin" : ""}`} />
                </button>
              ) : null}
            </header>

            <div className="p-6">
              {batchId ? (
                <>
                  <div className="flex items-center justify-between rounded-[24px] border border-border bg-secondary/35 p-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                        Batch
                      </p>
                      <p className="mt-1 text-2xl font-black">#{batchId}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2.5 font-black text-primary">
                      {statusIcon(status?.status)}
                      {statusLabel(status?.status)}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Metric label="Total rows" value={totalRows} />
                    <Metric label="Processed" value={processedRows} />
                    <Metric label="Successful" value={successfulRows} />
                    <Metric label="Failed" value={failedRows} />
                  </div>

                  {failedRows > 0 ? (
                    <button
                      type="button"
                      onClick={() => downloadErrors.mutate({ batchId })}
                      disabled={downloadErrors.isPending}
                      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 text-sm font-black text-destructive disabled:opacity-50"
                    >
                      <Download className="h-4 w-4" />
                      Download error file
                    </button>
                  ) : null}
                </>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <Clock3 className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-4 font-black">No active import batch</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    Upload a file to begin.
                  </p>
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-[var(--shadow-card)]">
          <header className="flex items-center gap-3 border-b border-border/70 bg-secondary/35 px-6 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black">Import history</h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Previous student import batches.
              </p>
            </div>
          </header>

          <div className="p-6">
            {historyQuery.isPending ? (
              <div className="grid gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-2xl bg-muted" />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm font-semibold text-muted-foreground">
                No import history is available yet.
              </div>
            ) : (
              <div className="grid gap-3">
                {history.map((item) => {
                  const failed = item.failedRows ?? item.failed_rows ?? 0;
                  return (
                    <article
                      key={String(item.id)}
                      className="flex flex-col gap-3 rounded-[22px] border border-border/70 bg-secondary/25 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-black">
                          {item.fileName ?? item.file_name ?? `Import batch #${item.id}`}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-muted-foreground">
                          {statusLabel(item.status)} ·{" "}
                          {item.createdAt ?? item.created_at ?? "Unknown date"}
                        </p>
                      </div>

                      {failed > 0 ? (
                        <button
                          type="button"
                          onClick={() => downloadErrors.mutate({ batchId: item.id })}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-destructive/10 px-4 text-sm font-black text-destructive"
                        >
                          <Download className="h-4 w-4" />
                          Errors ({failed})
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-black text-success">
                          <CheckCircle2 className="h-4 w-4" />
                          No errors
                        </span>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            {meta && meta.last_page > 1 ? (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={historyPage <= 1}
                  onClick={() => setHistoryPage((page) => page - 1)}
                  className="h-10 rounded-2xl border border-border bg-card px-4 text-sm font-black disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm font-black text-muted-foreground">
                  {historyPage} / {meta.last_page}
                </span>
                <button
                  type="button"
                  disabled={historyPage >= meta.last_page}
                  onClick={() => setHistoryPage((page) => page + 1)}
                  className="h-10 rounded-2xl border border-border bg-card px-4 text-sm font-black disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] border border-border/70 bg-card p-4">
      <p className="text-xs font-black uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

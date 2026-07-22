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
import type { StudentImportBatchStatusValue } from "../types/student.types";

const ACCEPTED_FILE_TYPES =
  ".xlsx,.xls,.csv";

function statusLabel(
  status?: StudentImportBatchStatusValue,
) {
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

function statusIcon(
  status?: StudentImportBatchStatusValue,
) {
  switch (status) {
    case "completed":
      return (
        <CheckCircle2
          size={17}
          strokeWidth={1.8}
        />
      );

    case "failed":
      return (
        <XCircle
          size={17}
          strokeWidth={1.8}
        />
      );

    case "processing":
      return (
        <LoaderCircle
          size={17}
          className="animate-spin"
        />
      );

    default:
      return (
        <Clock3
          size={17}
          strokeWidth={1.8}
        />
      );
  }
}

function statusTone(
  status?: StudentImportBatchStatusValue,
) {
  switch (status) {
    case "completed":
      return "bg-emerald-500/[0.09] text-emerald-600";

    case "failed":
      return "bg-destructive/[0.08] text-destructive";

    case "processing":
      return "bg-primary/[0.08] text-primary";

    case "pending":
      return "bg-amber-500/[0.09] text-amber-600";

    default:
      return "bg-muted/60 text-muted-foreground";
  }
}

export function StudentImportPage() {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [batchId, setBatchId] =
    useState<ApiId | null>(null);

  const [
    selectedFileName,
    setSelectedFileName,
  ] = useState<string | null>(null);

  const [historyPage, setHistoryPage] =
    useState(1);

  const importMutation =
    useImportStudents();

  const statusQuery =
    useStudentImportStatus(batchId);

  const historyQuery =
    useStudentImportHistory(historyPage);

  const downloadErrors =
    useDownloadStudentImportErrors();

  async function selectFile(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setSelectedFileName(file.name);

    try {
      const response =
        await importMutation.mutateAsync(
          file,
        );

      setBatchId(
        getStudentImportBatchId(
          response,
        ),
      );
    } catch {
      setSelectedFileName(null);
    }
  }

  const status = statusQuery.data;

  const processedRows =
    status?.processedRows ??
    status?.processed_rows ??
    0;

  const successfulRows =
    status?.successfulRows ??
    status?.successful_rows ??
    0;

  const failedRows =
    status?.failedRows ??
    status?.failed_rows ??
    0;

  const totalRows =
    status?.totalRows ??
    status?.total_rows ??
    processedRows;

  const history =
    historyQuery.data?.data ?? [];

  const meta =
    historyQuery.data?.meta;

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1450px] flex-col gap-6">
        <StudentPageHeader
          title="Import students"
          description="Upload a spreadsheet and monitor the processing result for every row."
          showBackButton
          icon={
            <FileSpreadsheet
              size={23}
              strokeWidth={1.7}
            />
          }
        />

        <section className="grid items-start gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <ImportPanel
            title="Upload student records"
            description="Accepted file types are XLSX, XLS and CSV."
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={selectFile}
              className="sr-only"
            />

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={
                importMutation.isPending
              }
              className={[
                "group flex min-h-64 w-full",
                "flex-col items-center justify-center",
                "rounded-[20px]",
                "border border-dashed border-primary/25",
                "bg-primary/[0.025] px-6",
                "text-center transition-all",
                "hover:border-primary/40",
                "hover:bg-primary/[0.045]",
                "disabled:cursor-not-allowed",
                "disabled:opacity-60",
              ].join(" ")}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary/[0.08] text-primary transition-transform group-hover:scale-105">
                {importMutation.isPending ? (
                  <LoaderCircle
                    size={28}
                    className="animate-spin"
                  />
                ) : (
                  <UploadCloud
                    size={28}
                    strokeWidth={1.6}
                  />
                )}
              </span>

              <span className="mt-5 text-base font-semibold text-foreground">
                {importMutation.isPending
                  ? "Uploading file..."
                  : "Choose import file"}
              </span>

              <span className="mt-2 max-w-md text-xs font-normal leading-5 text-muted-foreground">
                Academic year, grade and
                classroom should be provided by
                name.
              </span>
            </button>

            {selectedFileName ? (
              <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-border/60 bg-muted/[0.2] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/[0.07] text-primary">
                  <FileSpreadsheet
                    size={17}
                    strokeWidth={1.7}
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    Selected file
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-foreground">
                    {selectedFileName}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-amber-500/20 bg-amber-500/[0.055] p-4">
              <AlertCircle
                size={17}
                strokeWidth={1.75}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <p className="text-xs font-normal leading-5 text-foreground">
                Leave{" "}
                <code className="rounded bg-amber-500/[0.1] px-1.5 py-0.5 font-medium text-amber-700">
                  class_room_name
                </code>{" "}
                empty when no classroom is
                assigned.
              </p>
            </div>
          </ImportPanel>

          <ImportPanel
            title="Current batch"
            description="Live status for the latest uploaded file."
            action={
              batchId ? (
                <button
                  type="button"
                  onClick={() =>
                    void statusQuery.refetch()
                  }
                  disabled={
                    statusQuery.isFetching
                  }
                  aria-label="Refresh import status"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/65 bg-card text-muted-foreground transition hover:bg-primary/[0.045] hover:text-primary disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={
                      statusQuery.isFetching
                        ? "animate-spin"
                        : ""
                    }
                  />
                </button>
              ) : null
            }
          >
            {batchId ? (
              <>
                <div className="flex items-center justify-between gap-4 rounded-[18px] border border-border/60 bg-muted/[0.18] p-5">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      Import batch
                    </p>

                    <p className="mt-1 text-xl font-semibold text-foreground">
                      #{batchId}
                    </p>
                  </div>

                  <span
                    className={[
                      "inline-flex items-center gap-2",
                      "rounded-full px-3 py-2",
                      "text-xs font-medium",
                      statusTone(status?.status),
                    ].join(" ")}
                  >
                    {statusIcon(
                      status?.status,
                    )}

                    {statusLabel(
                      status?.status,
                    )}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Metric
                    label="Total rows"
                    value={totalRows}
                  />

                  <Metric
                    label="Processed"
                    value={processedRows}
                  />

                  <Metric
                    label="Successful"
                    value={successfulRows}
                    tone="success"
                  />

                  <Metric
                    label="Failed"
                    value={failedRows}
                    tone="danger"
                  />
                </div>

                {failedRows > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      downloadErrors.mutate({
                        batchId,
                      })
                    }
                    disabled={
                      downloadErrors.isPending
                    }
                    className={[
                      "mt-5 inline-flex h-11 w-full",
                      "items-center justify-center gap-2",
                      "rounded-xl border",
                      "border-destructive/15",
                      "bg-destructive/[0.055]",
                      "text-sm font-medium",
                      "text-destructive transition",
                      "hover:bg-destructive/[0.09]",
                      "disabled:opacity-50",
                    ].join(" ")}
                  >
                    <Download
                      size={16}
                      strokeWidth={1.8}
                    />

                    Download error report
                  </button>
                ) : null}
              </>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-muted/50 text-muted-foreground">
                  <Clock3
                    size={24}
                    strokeWidth={1.6}
                  />
                </span>

                <p className="mt-4 text-sm font-medium text-foreground">
                  No active import batch
                </p>

                <p className="mt-1 text-xs font-normal text-muted-foreground">
                  Upload a file to begin.
                </p>
              </div>
            )}
          </ImportPanel>
        </section>

        <ImportPanel
          title="Import history"
          description="Previously uploaded student batches."
          icon={
            <History
              size={18}
              strokeWidth={1.7}
            />
          }
        >
          {historyQuery.isPending ? (
            <div className="grid gap-3">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-[16px] bg-muted/55"
                />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-border/70 bg-muted/[0.1] p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                No import history
              </p>

              <p className="mt-1 text-xs font-normal text-muted-foreground">
                Uploaded batches will appear
                here.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {history.map((item) => {
                const failed =
                  item.failedRows ??
                  item.failed_rows ??
                  0;

                return (
                  <article
                    key={String(item.id)}
                    className="flex flex-col gap-4 rounded-[18px] border border-border/60 bg-card p-4 transition hover:bg-muted/[0.12] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.07] text-primary">
                        <FileSpreadsheet
                          size={18}
                          strokeWidth={1.7}
                        />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.fileName ??
                            item.file_name ??
                            `Import batch #${item.id}`}
                        </p>

                        <p className="mt-1 text-[11px] font-normal text-muted-foreground">
                          {statusLabel(
                            item.status,
                          )}{" "}
                          ·{" "}
                          {item.createdAt ??
                            item.created_at ??
                            "Unknown date"}
                        </p>
                      </div>
                    </div>

                    {failed > 0 ? (
                      <button
                        type="button"
                        onClick={() =>
                          downloadErrors.mutate({
                            batchId: item.id,
                          })
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-destructive/[0.06] px-4 text-xs font-medium text-destructive transition hover:bg-destructive/[0.1]"
                      >
                        <Download
                          size={15}
                          strokeWidth={1.8}
                        />

                        Errors ({failed})
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600">
                        <CheckCircle2
                          size={15}
                          strokeWidth={1.8}
                        />

                        No errors
                      </span>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {meta && meta.last_page > 1 ? (
            <div className="mt-5 flex items-center justify-center gap-3 border-t border-border/50 pt-5">
              <button
                type="button"
                disabled={historyPage <= 1}
                onClick={() =>
                  setHistoryPage(
                    (page) => page - 1,
                  )
                }
                className="h-10 rounded-xl border border-border/70 bg-card px-4 text-xs font-medium text-foreground transition hover:bg-muted/40 disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-xs font-medium text-muted-foreground">
                {historyPage} /{" "}
                {meta.last_page}
              </span>

              <button
                type="button"
                disabled={
                  historyPage >= meta.last_page
                }
                onClick={() =>
                  setHistoryPage(
                    (page) => page + 1,
                  )
                }
                className="h-10 rounded-xl border border-border/70 bg-card px-4 text-xs font-medium text-foreground transition hover:bg-muted/40 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </ImportPanel>
      </div>
    </main>
  );
}

function ImportPanel({
  title,
  description,
  icon,
  action,
  children,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        "overflow-hidden rounded-[24px]",
        "border border-border/60",
        "bg-card",
        "shadow-[0_12px_40px_rgba(30,20,70,0.05)]",
      ].join(" ")}
    >
      <header className="flex items-start justify-between gap-4 border-b border-border/50 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          {icon ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.07] text-primary">
              {icon}
            </span>
          ) : null}

          <div>
            <h2 className="text-base font-semibold tracking-[-0.015em] text-foreground">
              {title}
            </h2>

            <p className="mt-1 text-xs font-normal leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {action}
      </header>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "danger";
}) {
  return (
    <div className="rounded-[16px] border border-border/60 bg-card p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-2 text-xl font-semibold",
          tone === "success"
            ? "text-emerald-600"
            : "",
          tone === "danger"
            ? "text-destructive"
            : "",
          tone === "default"
            ? "text-foreground"
            : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
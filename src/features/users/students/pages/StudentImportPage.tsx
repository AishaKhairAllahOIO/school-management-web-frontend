import {
  type ChangeEvent,
  useState,
} from "react";
import {
  Download,
  FileSpreadsheet,
  History,
  UploadCloud,
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

export function StudentImportPage() {
  const [batchId, setBatchId] =
    useState<ApiId | null>(null);
  const [historyPage, setHistoryPage] = useState(1);

  const importMutation = useImportStudents();
  const statusQuery = useStudentImportStatus(batchId);
  const historyQuery =
    useStudentImportHistory(historyPage);
  const downloadErrors =
    useDownloadStudentImportErrors();

  async function selectFile(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const response =
      await importMutation.mutateAsync(file);
    setBatchId(getStudentImportBatchId(response));
  }

  const status = statusQuery.data;
  const history = historyQuery.data?.data ?? [];
  const meta = historyQuery.data?.meta;

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1450px] flex-col gap-6">
        <StudentPageHeader
          title="Import students"
          description="Upload an Excel or CSV file, track processing, review history, and download validation errors."
          showBackButton
          icon={<FileSpreadsheet className="h-7 w-7" />}
        />

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="soft-purple-gradient rounded-[34px] border border-primary/15 p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-card text-primary shadow-[var(--shadow-floating)]">
              <UploadCloud className="h-9 w-9" />
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight text-foreground">
              Upload student records
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Select an XLSX, XLS, or CSV file. The server will process it as a batch and report successful and failed rows.
            </p>

            <label className="primary-gradient mt-7 inline-flex h-12 cursor-pointer items-center gap-2 rounded-2xl px-6 text-sm font-black text-primary-foreground shadow-[var(--shadow-auth-button)]">
              {importMutation.isPending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
              Choose import file
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                disabled={importMutation.isPending}
                onChange={selectFile}
              />
            </label>
          </div>

          <section className="rounded-[34px] border border-border/70 bg-card p-6 shadow-[var(--shadow-card)]">
            <p className="text-xs font-black uppercase tracking-[0.13em] text-primary">
              Current batch
            </p>

            {batchId ? (
              <>
                <h2 className="mt-2 text-2xl font-black text-foreground">
                  Batch #{batchId}
                </h2>

                <div className="mt-5 rounded-[24px] bg-muted/65 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    Status
                  </p>
                  <p className="mt-1 text-lg font-black capitalize text-foreground">
                    {status?.status ??
                      "Waiting for status..."}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Metric
                    label="Total"
                    value={
                      status?.totalRows ??
                      status?.total_rows ??
                      0
                    }
                  />
                  <Metric
                    label="Success"
                    value={
                      status?.successfulRows ??
                      status?.successful_rows ??
                      0
                    }
                  />
                  <Metric
                    label="Failed"
                    value={
                      status?.failedRows ??
                      status?.failed_rows ??
                      0
                    }
                  />
                </div>

                {(status?.failedRows ??
                  status?.failed_rows ??
                  0) > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      downloadErrors.mutate({
                        batchId,
                      })
                    }
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 text-sm font-bold text-destructive"
                  >
                    <Download className="h-4 w-4" />
                    Download error file
                  </button>
                ) : null}
              </>
            ) : (
              <p className="mt-4 text-sm font-medium leading-6 text-muted-foreground">
                Upload a file to start a new batch.
              </p>
            )}
          </section>
        </section>

        <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-[var(--shadow-card)]">
          <header className="flex items-center gap-3 border-b border-border/70 bg-secondary/35 px-5 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">
                Import history
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                Previous student import batches.
              </p>
            </div>
          </header>

          <div className="p-5">
            {historyQuery.isPending ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-2xl bg-muted"
                  />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-border p-8 text-center text-sm font-semibold text-muted-foreground">
                No import history is available yet.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => {
                  const failed =
                    item.failedRows ??
                    item.failed_rows ??
                    0;

                  return (
                    <article
                      key={item.id}
                      className="flex flex-col gap-4 rounded-[24px] border border-border/70 bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-black text-foreground">
                          {item.fileName ??
                            item.file_name ??
                            `Import batch #${item.id}`}
                        </p>
                        <p className="mt-1 text-xs font-semibold capitalize text-muted-foreground">
                          {item.status} ·{" "}
                          {item.createdAt ??
                            item.created_at ??
                            "Unknown date"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Metric
                          label="Total"
                          value={
                            item.totalRows ??
                            item.total_rows ??
                            0
                          }
                        />
                        <Metric
                          label="Failed"
                          value={failed}
                        />
                        {failed > 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              downloadErrors.mutate({
                                batchId: item.id,
                              })
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
                            aria-label="Download import errors"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {meta && meta.last_page > 1 ? (
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={historyPage <= 1}
                  onClick={() =>
                    setHistoryPage((page) => page - 1)
                  }
                  className="h-10 rounded-2xl border border-border bg-card px-4 text-sm font-bold disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm font-bold text-muted-foreground">
                  {historyPage} / {meta.last_page}
                </span>
                <button
                  type="button"
                  disabled={
                    historyPage >= meta.last_page
                  }
                  onClick={() =>
                    setHistoryPage((page) => page + 1)
                  }
                  className="h-10 rounded-2xl border border-border bg-card px-4 text-sm font-bold disabled:opacity-40"
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

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-20 rounded-2xl border border-border bg-card px-3 py-2 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-foreground">
        {value}
      </p>
    </div>
  );
}

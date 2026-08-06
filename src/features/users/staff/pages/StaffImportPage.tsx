import { type ChangeEvent, useRef, useState } from "react";
import {
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
import { useNavigate } from "react-router-dom";

import { UserPageBackButton } from "../../shared/components/UserPageBackButton";
import type { ApiId } from "../../shared/types/api.types";
import { staffSectionConfigs } from "../config/staff.config";
import {
  getStaffImportBatchId,
  useDownloadStaffImportErrors,
  useImportStaff,
  useStaffImportStatus,
} from "../hooks/useStaffImport";
import type {
  StaffImportBatchStatusValue,
  StaffRole,
  StaffSectionColor,
} from "../types/staff.types";

const ACCEPTED = ".xlsx,.xls,.csv";

function statusLabel(status?: StaffImportBatchStatusValue) {
  return status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Waiting";
}

function statusIcon(status?: StaffImportBatchStatusValue) {
  if (status === "completed") return <CheckCircle2 size={17} strokeWidth={1.8} />;
  if (status === "failed") return <XCircle size={17} strokeWidth={1.8} />;
  if (status === "processing") return <LoaderCircle size={17} className="animate-spin" />;
  return <Clock3 size={17} strokeWidth={1.8} />;
}

function statusTone(status: StaffImportBatchStatusValue | undefined, color: StaffSectionColor) {
  if (status === "completed") return "bg-emerald-500/[0.09] text-emerald-600";
  if (status === "failed") return "bg-destructive/[0.08] text-destructive";
  if (status === "processing") return [color.light, color.text].join(" ");
  if (status === "pending") return "bg-amber-500/[0.09] text-amber-600";
  return "bg-muted/60 text-muted-foreground";
}

type StaffImportPageProps = { role: StaffRole };

export function StaffImportPage({ role }: StaffImportPageProps) {
  const navigate = useNavigate();
  const config = staffSectionConfigs[role];
  const inputRef = useRef<HTMLInputElement>(null);
  const [batchId, setBatchId] = useState<ApiId | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const importMutation = useImportStaff(role);
  const statusQuery = useStaffImportStatus(batchId);
  const downloadErrors = useDownloadStaffImportErrors();

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setFileName(file.name);
    try {
      const response = await importMutation.mutateAsync(file);
      setBatchId(getStaffImportBatchId(response));
    } catch {
      setFileName(null);
    }
  }

  const data = statusQuery.data;
  const processed = data?.processedRows ?? data?.processed_rows ?? 0;
  const success = data?.successfulRows ?? data?.successful_rows ?? 0;
  const failed = data?.failedRows ?? data?.failed_rows ?? 0;
  const total = data?.totalRows ?? data?.total_rows ?? processed;

  return (
    <main className="-mt-6 text-foreground">
      <div className="flex flex-col gap-5">
        <UserPageBackButton
          label={`Back to ${config.pluralLabel}`}
          onClick={() => navigate(config.listPath)}
        />

        <header className="overflow-hidden rounded-[24px] border border-border/60 bg-card px-5 py-5 sm:px-6">
          <div className="flex items-center gap-4">
            <span className={["flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px]", config.color.light, config.color.text].join(" ")}>
              <FileSpreadsheet size={23} strokeWidth={1.7} />
            </span>
            <div>
              <p className={["text-[10px] font-semibold uppercase tracking-[0.14em]", config.color.text].join(" ")}>Staff import</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-[-0.025em]">Import {config.pluralLabel}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a spreadsheet and monitor the processing result for every row.
              </p>
            </div>
          </div>
        </header>

        <section className="grid items-start gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <ImportPanel
            title={`Upload ${config.pluralLabel.toLowerCase()} records`}
            description="Accepted file types are XLSX, XLS and CSV."
          >
            <input ref={inputRef} type="file" accept={ACCEPTED} onChange={onFile} className="sr-only" />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={importMutation.isPending}
              className={[
                "group flex min-h-64 w-full flex-col items-center justify-center rounded-[18px] border px-6 text-center transition-all",
                "border-border/55 bg-card disabled:cursor-not-allowed disabled:opacity-60",
                config.color.hover,
              ].join(" ")}
            >
              <span className={["flex h-16 w-16 items-center justify-center rounded-[18px] transition-transform group-hover:scale-105", config.color.light, config.color.text].join(" ")}>
                {importMutation.isPending ? <LoaderCircle size={28} className="animate-spin" /> : <UploadCloud size={28} strokeWidth={1.6} />}
              </span>
              <span className="mt-5 text-base font-semibold">
                {importMutation.isPending ? "Uploading file..." : "Choose import file"}
              </span>
              <span className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">
                The staff role is selected automatically from the current page.
              </span>
            </button>

            {fileName ? (
              <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-border/60 bg-muted/[0.2] p-4">
                <span className={["flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", config.color.light, config.color.text].join(" ")}>
                  <FileSpreadsheet size={17} strokeWidth={1.7} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Selected file</p>
                  <p className="mt-1 truncate text-sm font-medium">{fileName}</p>
                </div>
              </div>
            ) : null}
          </ImportPanel>

          <ImportPanel
            title="Current batch"
            description="Live status for the latest uploaded file."
            action={batchId ? (
              <button
                type="button"
                onClick={() => void statusQuery.refetch()}
                disabled={statusQuery.isFetching}
                aria-label="Refresh import status"
                className={["flex h-9 w-9 items-center justify-center rounded-xl border bg-card transition disabled:opacity-50", config.color.border, config.color.text, config.color.hover].join(" ")}
              >
                <RefreshCw size={15} className={statusQuery.isFetching ? "animate-spin" : ""} />
              </button>
            ) : null}
          >
            {batchId ? (
              <>
                <div className="flex items-center justify-between gap-4 rounded-[18px] border border-border/60 bg-muted/[0.18] p-5">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Import batch</p>
                    <p className="mt-1 text-xl font-semibold">#{batchId}</p>
                  </div>
                  <span className={["inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium", statusTone(data?.status, config.color)].join(" ")}>
                    {statusIcon(data?.status)}
                    {statusLabel(data?.status)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Metric label="Total rows" value={total} />
                  <Metric label="Processed" value={processed} />
                  <Metric label="Successful" value={success} tone="success" />
                  <Metric label="Failed" value={failed} tone="danger" />
                </div>

                {failed > 0 ? (
                  <button
                    type="button"
                    onClick={() => downloadErrors.mutate({ batchId })}
                    disabled={downloadErrors.isPending}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/[0.04] text-sm font-medium text-destructive transition hover:bg-destructive/[0.08] disabled:opacity-50"
                  >
                    <Download size={16} strokeWidth={1.8} />
                    Download error report
                  </button>
                ) : null}
              </>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <span className={["flex h-14 w-14 items-center justify-center rounded-[18px]", config.color.light, config.color.text].join(" ")}>
                  <Clock3 size={24} strokeWidth={1.6} />
                </span>
                <p className="mt-4 text-sm font-medium">No active import batch</p>
                <p className="mt-1 text-xs text-muted-foreground">Upload a file to begin.</p>
              </div>
            )}
          </ImportPanel>
        </section>

        <ImportPanel
          title="Import history"
          description={`Previously uploaded ${config.pluralLabel.toLowerCase()} batches.`}
          icon={<History size={18} strokeWidth={1.7} />}
          iconClassName={[config.color.light, config.color.text].join(" ")}
        >
          <div className="rounded-[18px] border border-dashed border-border/70 bg-card p-8 text-center">
            <p className="text-sm font-medium">No import history</p>
            <p className="mt-1 text-xs text-muted-foreground">Uploaded batches will appear here when history data is available.</p>
          </div>
        </ImportPanel>
      </div>
    </main>
  );
}

function ImportPanel({
  title,
  description,
  action,
  icon,
  iconClassName,
  children,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  iconClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-border/60 bg-card">
      <header className="flex items-start justify-between gap-4 border-b border-border/50 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          {icon ? (
            <span className={["flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px]", iconClassName ?? "bg-muted/50 text-muted-foreground"].join(" ")}>
              {icon}
            </span>
          ) : null}
          <div>
            <h2 className="text-base font-semibold tracking-[-0.015em]">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
          </div>
        </div>
        {action}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Metric({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "success" | "danger" }) {
  return (
    <div className="rounded-[16px] border border-border/60 bg-card p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p className={[
        "mt-2 text-xl font-semibold",
        tone === "success" ? "text-emerald-600" : "",
        tone === "danger" ? "text-destructive" : "",
        tone === "default" ? "text-foreground" : "",
      ].join(" ")}>{value}</p>
    </div>
  );
}

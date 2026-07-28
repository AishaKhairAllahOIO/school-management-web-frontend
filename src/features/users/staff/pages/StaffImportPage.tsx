import { type ChangeEvent, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, Download, FileSpreadsheet, LoaderCircle, RefreshCw, UploadCloud, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ApiId } from "../../shared/types/api.types";
import type { StaffImportBatchStatusValue } from "../types/staff.types";
import { getStaffImportBatchId, useDownloadStaffImportErrors, useImportStaff, useStaffImportStatus } from "../hooks/useStaffImport";

const ACCEPTED = ".xlsx,.xls,.csv";

function label(status?: StaffImportBatchStatusValue) {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Waiting";
}

function icon(status?: StaffImportBatchStatusValue) {
  if (status === "completed") return <CheckCircle2 size={17} />;
  if (status === "failed") return <XCircle size={17} />;
  if (status === "processing") return <LoaderCircle size={17} className="animate-spin" />;
  return <Clock3 size={17} />;
}

export function StaffImportPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [batchId, setBatchId] = useState<ApiId | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const importMutation = useImportStaff();
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

  return <main className="min-h-screen bg-background px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1250px] space-y-6">
      <header className="flex items-center justify-between rounded-[24px] border border-border/70 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70"><ArrowLeft size={18} /></button>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary"><FileSpreadsheet size={23} /></span>
          <div><h1 className="text-2xl font-semibold">Import staff</h1><p className="mt-1 text-sm text-muted-foreground">Upload staff records and monitor the batch result.</p></div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[24px] border border-border/70 bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Upload staff records</h2>
          <p className="mt-1 text-sm text-muted-foreground">Accepted file types: XLSX, XLS and CSV.</p>
          <input ref={inputRef} type="file" accept={ACCEPTED} onChange={onFile} className="sr-only" />
          <button type="button" onClick={() => inputRef.current?.click()} disabled={importMutation.isPending} className="mt-5 flex min-h-64 w-full flex-col items-center justify-center rounded-[20px] border border-dashed border-primary/25 bg-primary/[0.025] px-6 text-center transition hover:bg-primary/[0.045] disabled:opacity-60">
            <span className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary/[0.08] text-primary">{importMutation.isPending ? <LoaderCircle size={28} className="animate-spin" /> : <UploadCloud size={28} />}</span>
            <span className="mt-5 font-semibold">{importMutation.isPending ? "Uploading file..." : "Choose import file"}</span>
            <span className="mt-2 text-xs text-muted-foreground">The spreadsheet must follow the backend staff import template.</span>
          </button>
          {fileName && <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm"><span className="text-muted-foreground">Selected file: </span><span className="font-medium">{fileName}</span></div>}
        </article>

        <article className="rounded-[24px] border border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between"><div><h2 className="font-semibold">Current batch</h2><p className="mt-1 text-sm text-muted-foreground">Live status for the latest upload.</p></div>{batchId && <button type="button" onClick={() => void statusQuery.refetch()} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70"><RefreshCw size={15} className={statusQuery.isFetching ? "animate-spin" : ""} /></button>}</div>
          {batchId ? <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 p-5"><div><p className="text-xs text-muted-foreground">Import batch</p><p className="mt-1 text-xl font-semibold">#{batchId}</p></div><span className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-3 py-2 text-xs font-medium text-primary">{icon(data?.status)}{label(data?.status)}</span></div>
            <div className="grid grid-cols-2 gap-3">{[["Total rows", total],["Processed", processed],["Successful", success],["Failed", failed]].map(([k,v]) => <div key={String(k)} className="rounded-2xl border border-border/60 p-4"><p className="text-xs text-muted-foreground">{k}</p><p className="mt-2 text-2xl font-semibold">{v}</p></div>)}</div>
            {failed > 0 && <button type="button" onClick={() => downloadErrors.mutate({ batchId })} disabled={downloadErrors.isPending} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/[0.06] text-sm font-medium text-destructive"><Download size={16} />Download error rows</button>}
          </div> : <div className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-[20px] border border-dashed border-border/70 text-center"><Clock3 className="text-muted-foreground" /><p className="mt-3 font-medium">No active import batch</p><p className="mt-1 text-xs text-muted-foreground">Choose a file to start importing staff.</p></div>}
        </article>
      </section>
    </div>
  </main>;
}

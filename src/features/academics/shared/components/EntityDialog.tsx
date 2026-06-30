import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
};

export function EntityDialog({ title, children, onClose, onSubmit, submitLabel = "Save" }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/30 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black tracking-[-0.03em] text-slate-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <X size={16} />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-600">
            Cancel
          </button>
          <button type="button" onClick={onSubmit} className="h-10 rounded-xl bg-indigo-600 px-4 text-sm font-black text-white">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

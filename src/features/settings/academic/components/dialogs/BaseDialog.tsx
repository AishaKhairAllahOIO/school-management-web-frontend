import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function BaseDialog({ title, children, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function DialogField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-xs font-black text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export const dialogInputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none transition focus:border-primary";

export function DialogActions({ onClose, onSave, disabled }: { onClose: () => void; onSave: () => void; disabled?: boolean }) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-700">
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={disabled}
        className="h-10 rounded-xl bg-primary px-4 text-sm font-black text-white disabled:opacity-50"
      >
        Save
      </button>
    </div>
  );
}

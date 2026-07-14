import { Plus } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
};

export function SectionHeader({ title, description, actionLabel, onAction, children }: Props) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">{title}</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>
        {children}
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 text-sm font-black text-primary transition hover:bg-indigo-50"
        >
          <Plus size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

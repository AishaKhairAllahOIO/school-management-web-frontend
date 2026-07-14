import { Plus } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
};

export function AcademicsPageShell({ title, description, addLabel, onAdd, children }: Props) {
  return (
    <div className="space-y-5 text-slate-950">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-black tracking-[-0.05em]">{title}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-black text-white shadow-sm"
        >
          <Plus size={16} />
          {addLabel}
        </button>
      </header>
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
        {children}
      </section>
    </div>
  );
}

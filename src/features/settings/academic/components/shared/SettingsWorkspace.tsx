import type { ReactNode } from "react";

type WorkspaceNavItem = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
};

type Props = {
  items: WorkspaceNavItem[];
  activeId: string;
  onChange: (id: string) => void;
  children: ReactNode;
  hint?: string;
};

export function SettingsWorkspace({ items, activeId, onChange, children, hint }: Props) {
  return (
    <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-6">
      <aside className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
        <h2 className="px-2 py-2 text-base font-black text-slate-900">Settings</h2>
        <div className="mt-3 space-y-2">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={[
                  "flex w-full items-start gap-3 rounded-2xl px-4 py-4 text-left transition",
                  active ? "bg-indigo-50 text-primary shadow-sm" : "text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                <span className="mt-0.5 text-current">{item.icon}</span>
                <span>
                  <span className="block text-sm font-black text-slate-900">{item.title}</span>
                  <span className="mt-1 block text-xs font-medium text-slate-500">{item.description}</span>
                </span>
              </button>
            );
          })}
        </div>

        {hint && (
          <div className="mt-8 rounded-2xl bg-indigo-50 px-4 py-4 text-xs font-semibold leading-5 text-primary">
            {hint}
          </div>
        )}
      </aside>

      <main className="min-w-0 rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
        {children}
      </main>
    </div>
  );
}

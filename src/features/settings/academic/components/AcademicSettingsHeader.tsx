import { Save } from "lucide-react";

export function AcademicSettingsHeader() {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <h1 className="text-[32px] font-black tracking-[-0.05em] text-slate-900">Academic Settings</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Manage academic years, terms, stages and school schedule settings.
        </p>
      </div>

      <button
        type="button"
        className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-white shadow-sm transition hover:bg-primary/90"
      >
        <Save size={16} />
        Save Changes
      </button>
    </header>
  );
}

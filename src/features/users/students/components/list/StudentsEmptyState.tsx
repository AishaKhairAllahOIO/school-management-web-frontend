import { SearchX, Sparkles, UserPlus } from "lucide-react";

type StudentsEmptyStateProps = {
  hasSearch: boolean;
  onAddStudent: () => void;
  onReset: () => void;
};

export function StudentsEmptyState({
  hasSearch,
  onAddStudent,
  onReset,
}: StudentsEmptyStateProps) {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-dashed border-primary/25 bg-card px-6 py-16 text-center shadow-[var(--shadow-card)]">
      <div className="soft-purple-gradient pointer-events-none absolute inset-0 opacity-75" />
      <div className="relative mx-auto max-w-lg">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] border border-primary/15 bg-card/85 text-primary shadow-[var(--shadow-floating)] backdrop-blur">
          {hasSearch ? <SearchX className="h-10 w-10" /> : <UserPlus className="h-10 w-10" />}
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {hasSearch ? "No matching profiles" : "Start your directory"}
        </div>

        <h2 className="mt-4 text-2xl font-black tracking-tight text-foreground">
          {hasSearch ? "We could not find any students" : "No students have been added yet"}
        </h2>

        <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
          {hasSearch
            ? "Try a different name, status, or sorting option. You can also reset all filters and browse the full directory."
            : "Create the first student profile and connect their guardian and academic enrollment in one guided flow."}
        </p>

        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          {hasSearch ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-card px-5 text-sm font-bold text-foreground transition hover:border-primary/25 hover:bg-secondary"
            >
              Reset filters
            </button>
          ) : null}

          <button
            type="button"
            onClick={onAddStudent}
            className="primary-gradient inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-auth-button)] transition hover:-translate-y-0.5"
          >
            <UserPlus className="h-4 w-4" />
            Add student
          </button>
        </div>
      </div>
    </section>
  );
}

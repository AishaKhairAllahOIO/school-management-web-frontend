import {
  Save,
  X,
} from "lucide-react";
import type {
  ReactNode,
} from "react";

type Props = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
};

export function EntityDialog({
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = "Save",
}: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/35 p-2 backdrop-blur-[5px] sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="flex max-h-[calc(100dvh-1rem)] w-full max-w-[720px] flex-col overflow-hidden sm:max-h-[90vh] rounded-[24px] border border-border/60 bg-card shadow-[0_28px_90px_rgba(15,10,40,0.22)] animate-in zoom-in-95 fade-in duration-200">
        <header className="relative overflow-hidden border-b border-border/60 bg-card px-5 py-4 sm:px-6">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/[0.055] blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
                Record form
              </p>

              <h2 className="mt-1 text-[17px] font-semibold tracking-tight text-foreground">
                {title}
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Complete the fields below, then save your changes.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close dialog"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
            >
              <X size={17} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 [scrollbar-width:thin]">
          <div className="grid gap-4 sm:grid-cols-2">
            {children}
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-border/60 bg-muted/[0.14] p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full border border-border/70 bg-card px-6 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <Save size={15} />
            {submitLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}

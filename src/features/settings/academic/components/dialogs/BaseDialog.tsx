import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function BaseDialog({
  title,
  children,
  onClose,
}: Props) {
  return (
    <div
      className={[
        "fixed inset-0 z-[100]",
        "flex items-center justify-center",
        "bg-slate-950/35 p-4",
        "backdrop-blur-[3px]",
      ].join(" ")}
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className={[
          "w-full max-w-md",
          "overflow-hidden rounded-[24px]",
          "border border-border/70",
          "bg-card",
          "shadow-[0_28px_80px_rgba(15,10,40,0.2)]",
        ].join(" ")}
      >
        <header className="flex items-center justify-between border-b border-border/55 px-5 py-4">
          <h2 className="text-base font-semibold tracking-[-0.015em] text-foreground">
            {title}
          </h2>

          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className={[
              "flex h-9 w-9 items-center justify-center",
              "rounded-xl border border-border/65",
              "text-muted-foreground",
              "transition-colors",
              "hover:bg-muted/50",
              "hover:text-foreground",
            ].join(" ")}
          >
            <X
              size={16}
              strokeWidth={1.8}
            />
          </button>
        </header>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-xs font-medium text-foreground">
        {label}
      </span>

      {children}
    </label>
  );
}

export const dialogInputClass = [
  "h-11 w-full rounded-xl",
  "border border-border/75",
  "bg-background px-3.5",
  "text-sm font-normal text-foreground",
  "outline-none transition-all",
  "placeholder:text-muted-foreground",
  "focus:border-primary/45",
  "focus:ring-4",
  "focus:ring-primary/10",
].join(" ");

export function DialogActions({
  onClose,
  onSave,
  disabled,
}: {
  onClose: () => void;
  onSave: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 flex justify-end gap-3 border-t border-border/50 pt-5">
      <button
        type="button"
        onClick={onClose}
        className={[
          "h-10 rounded-xl",
          "border border-border/75",
          "bg-card px-4",
          "text-sm font-medium text-foreground",
          "transition-colors",
          "hover:bg-muted/50",
        ].join(" ")}
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={disabled}
        className={[
          "h-10 rounded-xl",
          "bg-primary px-5",
          "text-sm font-medium",
          "text-primary-foreground",
          "shadow-sm transition",
          "hover:bg-primary/90",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
        ].join(" ")}
      >
        Save
      </button>
    </div>
  );
}
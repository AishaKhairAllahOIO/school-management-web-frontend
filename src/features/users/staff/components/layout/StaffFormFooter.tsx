import {
  Save,
} from "lucide-react";

type StaffFormFooterProps = {
  loading: boolean;

  submitLabel: string;

  cancelLabel?: string;

  hint?: string;

  onCancel: () => void;
};

export function StaffFormFooter({
  loading,
  submitLabel,

  cancelLabel = "Cancel",

  hint = "Review the information before saving.",

  onCancel,
}: StaffFormFooterProps) {
  return (
    <footer
      className={[
        "fixed inset-x-0 bottom-0 z-30",
        "border-t border-border/70",
        "bg-background/90",
        "px-4 py-3",
        "backdrop-blur-xl",

        "lg:left-[var(--sidebar-width,0px)]",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto",

          "flex items-center",

          "justify-between",

          "gap-3",

          "max-w-7xl",
        ].join(" ")}
      >
        <p className="hidden text-xs text-muted-foreground sm:block">
          {hint}
        </p>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className={[
              "inline-flex",

              "h-11",

              "items-center justify-center",

              "rounded-xl",

              "border border-border",

              "bg-card",

              "px-5",

              "text-sm font-semibold",

              "text-foreground",

              "transition",

              "hover:bg-muted",

              "disabled:cursor-not-allowed",

              "disabled:opacity-50",
            ].join(" ")}
          >
            {cancelLabel}
          </button>

          <button
            type="submit"
            disabled={loading}
            className={[
              "primary-gradient",

              "inline-flex",

              "h-11",

              "items-center justify-center gap-2",

              "rounded-xl",

              "px-5",

              "text-sm font-semibold",

              "text-primary-foreground",

              "shadow-[var(--shadow-auth-button)]",

              "transition-transform",

              "hover:-translate-y-0.5",

              "disabled:translate-y-0",

              "disabled:cursor-not-allowed",

              "disabled:opacity-60",
            ].join(" ")}
          >
            <Save className="h-4 w-4" />

            {loading
              ? "Saving..."
              : submitLabel}
          </button>
        </div>
      </div>
    </footer>
  );
}
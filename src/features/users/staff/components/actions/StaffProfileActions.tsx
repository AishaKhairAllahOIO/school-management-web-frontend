import {
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

type StaffProfileActionsProps = {
  isDeleted?: boolean;

  isEnabled?: boolean;

  pendingToggle?: boolean;

  pendingDelete?: boolean;

  disabled?: boolean;

  onEdit: () => void;

  onToggleStatus: () => void;

  onDelete: () => void;
};

export function StaffProfileActions({
  isDeleted = false,
  isEnabled = true,
  pendingToggle = false,
  pendingDelete = false,
  disabled = false,
  onEdit,
  onToggleStatus,
  onDelete,
}: StaffProfileActionsProps) {
  const isBusy =
    disabled ||
    pendingToggle ||
    pendingDelete;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={
          isBusy ||
          isDeleted
        }
        onClick={onEdit}
        className={[
          "inline-flex h-11 items-center justify-center gap-2",
          "rounded-xl border border-border",
          "bg-card px-5",
          "text-sm font-semibold text-foreground",
          "shadow-[var(--shadow-card)]",
          "transition-all",
          "hover:border-primary/20",
          "hover:bg-primary/[0.04]",
          "hover:text-primary",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-primary/10",
          "disabled:cursor-not-allowed",
          "disabled:opacity-45",
        ].join(" ")}
      >
        <Pencil className="h-4 w-4" />

        Edit
      </button>

      <button
        type="button"
        disabled={
          isBusy ||
          isDeleted
        }
        onClick={
          onToggleStatus
        }
        className={[
          "inline-flex h-11 items-center justify-center gap-2",
          "rounded-xl px-5",
          "text-sm font-semibold",
          "transition-all",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-warning/10",
          "disabled:cursor-not-allowed",
          "disabled:opacity-45",

          isEnabled
            ? [
                "border border-warning/20",
                "bg-warning/[0.08]",
                "text-warning",
                "hover:bg-warning/[0.14]",
              ].join(" ")
            : [
                "border border-success/20",
                "bg-success/[0.08]",
                "text-success",
                "hover:bg-success/[0.14]",
              ].join(" "),
        ].join(" ")}
      >
        {pendingToggle ? (
          <Spinner />
        ) : (
          <Power className="h-4 w-4" />
        )}

        {isEnabled
          ? "Disable"
          : "Enable"}
      </button>

      <button
        type="button"
        disabled={
          isBusy ||
          isDeleted
        }
        onClick={onDelete}
        className={[
          "inline-flex h-11 items-center justify-center gap-2",
          "rounded-xl border border-destructive/20",
          "bg-destructive/[0.06]",
          "px-5",
          "text-sm font-semibold text-destructive",
          "transition-all",
          "hover:bg-destructive/[0.12]",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-destructive/10",
          "disabled:cursor-not-allowed",
          "disabled:opacity-45",
        ].join(" ")}
      >
        {pendingDelete ? (
          <Spinner />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}

        Delete
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}
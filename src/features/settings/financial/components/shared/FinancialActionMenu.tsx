import {
  Edit3,
  Eye,
  Trash2,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onView?: () => void;
  onEdit: () => void;
  onDelete?: () => void;
};

export function FinancialActionMenu({
  onOpenChange,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="inline-flex items-center justify-end gap-2">
      {onView && (
        <button
          type="button"
          aria-label="View details"
          title="View details"
          onClick={() => {
            onOpenChange(false);
            onView();
          }}
          className={[
            "inline-flex h-10 w-10 shrink-0 items-center justify-center",
            "rounded-full border border-primary/15",
            "bg-primary/[0.045] text-primary",
            "transition-all duration-200",
            "hover:-translate-y-0.5",
            "hover:border-primary/25",
            "hover:bg-primary/[0.09]",
            "active:translate-y-0 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-4",
            "focus-visible:ring-primary/10",
          ].join(" ")}
        >
          <Eye size={16} strokeWidth={1.8} />
        </button>
      )}

      <button
        type="button"
        aria-label="Edit"
        title="Edit"
        onClick={() => {
          onOpenChange(false);
          onEdit();
        }}
        className={[
          "inline-flex h-10 w-10 shrink-0 items-center justify-center",
          "rounded-full border border-primary/15",
          "bg-primary/[0.045] text-primary",
          "transition-all duration-200",
          "hover:-translate-y-0.5",
          "hover:border-primary/25",
          "hover:bg-primary/[0.09]",
          "active:translate-y-0 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-4",
          "focus-visible:ring-primary/10",
        ].join(" ")}
      >
        <Edit3 size={16} strokeWidth={1.8} />
      </button>

      {onDelete && (
        <button
          type="button"
          aria-label="Delete"
          title="Delete"
          onClick={() => {
            onOpenChange(false);
            onDelete();
          }}
          className={[
            "inline-flex h-10 w-10 shrink-0 items-center justify-center",
            "rounded-full border border-destructive/20",
            "bg-destructive/[0.035] text-destructive",
            "transition-all duration-200",
            "hover:-translate-y-0.5",
            "hover:border-destructive/30",
            "hover:bg-destructive/[0.075]",
            "active:translate-y-0 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-4",
            "focus-visible:ring-destructive/10",
          ].join(" ")}
        >
          <Trash2 size={16} strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}
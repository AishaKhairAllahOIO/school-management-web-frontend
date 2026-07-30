import {
  Edit3,
  Trash2,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete?: () => void;
};

export function ActionMenu({
  onOpenChange,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="inline-flex items-center justify-end gap-2">
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
          "shadow-[0_3px_12px_rgba(98,68,220,0.06)]",
          "transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-primary/25",
          "hover:bg-primary/[0.09] hover:shadow-[0_6px_18px_rgba(98,68,220,0.12)]",
          "active:translate-y-0 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-4",
          "focus-visible:ring-primary/10",
        ].join(" ")}
      >
        <Edit3 size={16} strokeWidth={1.8} />
      </button>

      {onDelete ? (
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
            "shadow-[0_3px_12px_rgba(220,38,38,0.04)]",
            "transition-all duration-200",
            "hover:-translate-y-0.5 hover:border-destructive/30",
            "hover:bg-destructive/[0.075] hover:shadow-[0_6px_18px_rgba(220,38,38,0.09)]",
            "active:translate-y-0 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-4",
            "focus-visible:ring-destructive/10",
          ].join(" ")}
        >
          <Trash2 size={16} strokeWidth={1.8} />
        </button>
      ) : null}
    </div>
  );
}

import {
  Edit3,
  MoreVertical,
  Trash2,
} from "lucide-react";

type Props = {
  isOpen: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  onEdit: () => void;

  onDelete?: () => void;
};

export function ActionMenu({
  isOpen,
  onOpenChange,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="relative inline-flex">
      <button
        type="button"
        aria-label="Open actions"
        aria-expanded={isOpen}
        onClick={() =>
          onOpenChange(!isOpen)
        }
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted"
      >
        <MoreVertical size={17} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-11 z-30 min-w-36 rounded-2xl border border-border bg-card p-2 shadow-xl">
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary/10"
          >
            <Edit3 size={15} />
            Edit
          </button>

          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-destructive transition hover:bg-destructive/10"
            >
              <Trash2 size={15} />
              Delete
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
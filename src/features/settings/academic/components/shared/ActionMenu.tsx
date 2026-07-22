import {
  Edit3,
  MoreHorizontal,
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
        className={[
          "flex h-9 w-9 items-center justify-center",
          "rounded-full border border-border/70",
          "bg-card text-muted-foreground",
          "transition-all duration-200",
          "hover:border-primary/20",
          "hover:bg-primary/[0.045]",
          "hover:text-primary",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-primary/10",
        ].join(" ")}
      >
        <MoreHorizontal
          size={17}
          strokeWidth={1.8}
        />
      </button>

      {isOpen ? (
        <div
          className={[
            "absolute right-0 top-11 z-30",
            "min-w-36 rounded-[16px]",
            "border border-border/65",
            "bg-card p-1.5",
            "shadow-[0_16px_45px_rgba(20,15,50,0.14)]",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onEdit();
            }}
            className={[
              "flex w-full items-center gap-2.5",
              "rounded-xl px-3 py-2.5",
              "text-xs font-medium text-foreground",
              "transition-colors",
              "hover:bg-primary/[0.06]",
              "hover:text-primary",
            ].join(" ")}
          >
            <Edit3
              size={14}
              strokeWidth={1.8}
            />

            Edit
          </button>

          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onDelete();
              }}
              className={[
                "flex w-full items-center gap-2.5",
                "rounded-xl px-3 py-2.5",
                "text-xs font-medium text-destructive",
                "transition-colors",
                "hover:bg-destructive/[0.07]",
              ].join(" ")}
            >
              <Trash2
                size={14}
                strokeWidth={1.8}
              />

              Delete
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
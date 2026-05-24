type UserDeleteDialogProps<T> = {
  item: T | null;
  title: string;
  getName: (item: T) => string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function UserDeleteDialog<T>({
  item,
  title,
  getName,
  onCancel,
  onConfirm,
}: UserDeleteDialogProps<T>) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-card p-6 shadow-premium">
        <h2 className="text-xl font-bold text-foreground">
          Delete {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Are you sure you want to delete{" "}
          <strong className="text-foreground">{getName(item)}</strong>?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-muted px-5 py-2.5 text-sm font-bold text-muted-foreground transition hover:text-foreground"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl bg-destructive px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
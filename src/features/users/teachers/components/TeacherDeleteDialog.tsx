import type { Teacher } from "../types/teacher.types";

type TeacherDeleteDialogProps = {
  teacher: Teacher | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function TeacherDeleteDialog({
  teacher,
  onCancel,
  onConfirm,
}: TeacherDeleteDialogProps) {
  if (!teacher) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-card p-6 shadow-soft-lg">
        <h2 className="text-xl font-bold text-foreground">Delete Teacher</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <strong>
            {teacher.firstName} {teacher.lastName}
          </strong>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-muted px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl bg-destructive px-5 py-2.5 text-sm font-bold text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
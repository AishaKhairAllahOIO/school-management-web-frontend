import type { FormEvent } from "react";
import { X } from "lucide-react";

import { BaseUserFields } from "./BaseUserFields";
import { CounselorFields } from "./CounselorFields";
import { EmploymentFields } from "./EmploymentFields";
import { ParentFields } from "./ParentFields";
import { SecretaryFields } from "./SecretaryFields";
import { ServiceStaffFields } from "./ServiceStaffFields";
import { StudentFields } from "./StudentFields";
import { SupervisorFields } from "./SupervisorFields";
import { TeacherFields } from "./TeacherFields";

import type {
  EditableUser,
  UserFormModalProps,
} from "@/features/users/shared/types/user-form.types";

const modeTitle = {
  create: "Add User",
  edit: "Edit User",
  view: "User Details",
};

export function UserFormModal({
  open,
  mode,
  category,
  user,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  if (!open) return null;

  const isViewMode = mode === "view";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isViewMode) return;

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());

    onSubmit({
      ...user,
      ...values,
      category,
    });
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border/70">
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {modeTitle[mode]}
            </h2>

            <p className="mt-1 text-sm capitalize text-muted-foreground">
              {category.replace("_", " ")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
            <BaseUserFields user={user} disabled={isViewMode} />

            {category === "student" && (
              <StudentFields user={user} disabled={isViewMode} />
            )}

            {category === "parent" && (
              <ParentFields user={user} disabled={isViewMode} />
            )}

            {["teacher", "secretary", "supervisor", "counselor"].includes(
              category
            ) && <EmploymentFields user={user} disabled={isViewMode} />}

            {category === "teacher" && (
              <TeacherFields user={user} disabled={isViewMode} />
            )}

            {category === "secretary" && (
              <SecretaryFields user={user} disabled={isViewMode} />
            )}

            {category === "supervisor" && (
              <SupervisorFields user={user} disabled={isViewMode} />
            )}

            {category === "counselor" && (
              <CounselorFields user={user} disabled={isViewMode} />
            )}

            {category === "service_staff" && (
              <ServiceStaffFields user={user} disabled={isViewMode} />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border/70 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl border border-border/70 bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Cancel
            </button>

            {!isViewMode && (
              <button
                type="submit"
                className="h-10 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
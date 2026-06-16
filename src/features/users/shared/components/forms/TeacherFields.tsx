import type { TeacherUser } from "@/features/users/teachers/types/teacher.types";

type TeacherFieldsProps = {
  user?: Partial<TeacherUser>;
  disabled?: boolean;
};

export function TeacherFields({
  user,
  disabled,
}: TeacherFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input
        name="subject"
        defaultValue={user?.subject}
        disabled={disabled}
        placeholder="Subject"
        className="form-input"
      />

      <input
        name="department"
        defaultValue={user?.department}
        disabled={disabled}
        placeholder="Department"
        className="form-input"
      />

      <input
        name="employmentType"
        defaultValue={user?.employmentType}
        disabled={disabled}
        placeholder="Employment Type"
        className="form-input"
      />
    </div>
  );
}
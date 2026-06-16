import type { StudentUser } from "@/features/users/students/types/student.types";

type StudentFieldsProps = {
  user?: Partial<StudentUser>;
  disabled?: boolean;
};

export function StudentFields({
  user,
  disabled,
}: StudentFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">
        Academic Information
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="gradeId"
          defaultValue={user?.gradeId}
          disabled={disabled}
          placeholder="Grade"
          className="form-input"
        />

        <input
          name="classroomId"
          defaultValue={user?.classroomId}
          disabled={disabled}
          placeholder="Classroom"
          className="form-input"
        />

        <input
          name="parentId"
          defaultValue={user?.parentId}
          disabled={disabled}
          placeholder="Parent"
          className="form-input"
        />
      </div>
    </div>
  );
}
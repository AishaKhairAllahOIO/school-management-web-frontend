import type { ParentUser } from "@/features/users/parents/types/parent.types";

type ParentFieldsProps = {
  user?: Partial<ParentUser>;
  disabled?: boolean;
};

export function ParentFields({ user, disabled }: ParentFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">
        Parent Information
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="relation"
          defaultValue={user?.relation}
          disabled={disabled}
          placeholder="Relation"
          className="form-input"
        />

        <input
          name="occupation"
          defaultValue={user?.occupation ?? ""}
          disabled={disabled}
          placeholder="Occupation"
          className="form-input"
        />
      </div>
    </div>
  );
}
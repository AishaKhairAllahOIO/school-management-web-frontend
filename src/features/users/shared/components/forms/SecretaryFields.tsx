import type { SecretaryUser } from "@/features/users/secretaries/types/secretary.types";

type SecretaryFieldsProps = {
  user?: Partial<SecretaryUser>;
  disabled?: boolean;
};

export function SecretaryFields({ user, disabled }: SecretaryFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">
        Secretary Information
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="secretaryEmail"
          defaultValue={user?.secretaryEmail}
          disabled={disabled}
          placeholder="Secretary Email"
          className="form-input"
        />
      </div>
    </div>
  );
}
import type { CounselorUser } from "@/features/users/counselors/types/counselor.types";

type CounselorFieldsProps = {
  user?: Partial<CounselorUser>;
  disabled?: boolean;
};

export function CounselorFields({ user, disabled }: CounselorFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">
        Counselor Information
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="counselorEmail"
          defaultValue={user?.counselorEmail}
          disabled={disabled}
          placeholder="Counselor Email"
          className="form-input"
        />

        <input
          name="office"
          defaultValue={user?.office ?? ""}
          disabled={disabled}
          placeholder="Office"
          className="form-input"
        />
      </div>
    </div>
  );
}
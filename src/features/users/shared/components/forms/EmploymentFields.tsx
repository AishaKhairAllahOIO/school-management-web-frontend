import type { EmploymentInformation } from "@/features/users/shared/types/employment.types";

type EmploymentFieldsProps = {
  user?: Partial<EmploymentInformation>;
  disabled?: boolean;
};

export function EmploymentFields({
  user,
  disabled,
}: EmploymentFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">
        Employment Information
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="hireDate"
          type="date"
          defaultValue={user?.hireDate}
          disabled={disabled}
          className="form-input"
        />

        <input
          name="degree"
          defaultValue={user?.degree}
          disabled={disabled}
          placeholder="Degree"
          className="form-input"
        />

        <input
          name="specialization"
          defaultValue={user?.specialization}
          disabled={disabled}
          placeholder="Specialization"
          className="form-input"
        />

        <input
          name="university"
          defaultValue={user?.university}
          disabled={disabled}
          placeholder="University"
          className="form-input"
        />

        <input
          name="graduationYear"
          defaultValue={user?.graduationYear}
          disabled={disabled}
          placeholder="Graduation Year"
          className="form-input"
        />

        <input
          name="yearsOfExperience"
          defaultValue={user?.yearsOfExperience}
          disabled={disabled}
          placeholder="Experience"
          className="form-input"
        />
      </div>
    </div>
  );
}
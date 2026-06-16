import type { ServiceStaffUser } from "@/features/users/service-staff/types/service-staff.types";

type ServiceStaffFieldsProps = {
  user?: Partial<ServiceStaffUser>;
  disabled?: boolean;
};

export function ServiceStaffFields({
  user,
  disabled,
}: ServiceStaffFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input
        name="jobType"
        defaultValue={user?.jobType}
        disabled={disabled}
        placeholder="Job Type"
        className="form-input"
      />

      <input
        type="date"
        name="hireDate"
        defaultValue={user?.hireDate}
        disabled={disabled}
        className="form-input"
      />
    </div>
  );
}
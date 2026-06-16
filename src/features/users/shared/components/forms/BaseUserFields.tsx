import type { BaseUser } from "@/features/users/shared/types/base-user.types";

type BaseUserFieldsProps = {
  user?: Partial<BaseUser>;
  disabled?: boolean;
};

export function BaseUserFields({
  user,
  disabled,
}: BaseUserFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">
        Personal Information
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="firstName"
          defaultValue={user?.firstName}
          disabled={disabled}
          placeholder="First Name"
          className="form-input"
        />

        <input
          name="lastName"
          defaultValue={user?.lastName}
          disabled={disabled}
          placeholder="Last Name"
          className="form-input"
        />

        <input
          name="fatherName"
          defaultValue={user?.fatherName}
          disabled={disabled}
          placeholder="Father Name"
          className="form-input"
        />

        <input
          name="motherName"
          defaultValue={user?.motherName}
          disabled={disabled}
          placeholder="Mother Name"
          className="form-input"
        />

        <input
          type="date"
          name="birthDate"
          defaultValue={user?.birthDate}
          disabled={disabled}
          className="form-input"
        />

        <input
          name="birthPlace"
          defaultValue={user?.birthPlace}
          disabled={disabled}
          placeholder="Birth Place"
          className="form-input"
        />

        <input
          name="phoneNumber"
          defaultValue={user?.phoneNumber}
          disabled={disabled}
          placeholder="Phone Number"
          className="form-input"
        />

        <input
          name="address"
          defaultValue={user?.address}
          disabled={disabled}
          placeholder="Address"
          className="form-input"
        />
      </div>
    </div>
  );
}
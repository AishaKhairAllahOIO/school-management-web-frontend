import {
  ContactRound,
} from "lucide-react";

import {
  StaffFormField,
} from "../fields/StaffFormField";

import {
  StaffSection,
} from "../layout/StaffSection";

import {
  defaultStaffSectionColor,
  getStaffFieldClassName,
} from "../theme/staff-theme";

import type {
  StaffSectionColor,
  RegisterStaffValues,
} from "../../types/staff.types";


type StaffContactFormSectionProps = {
  values: RegisterStaffValues;

  disabled?: boolean;

  emailRequired?: boolean;

  color?: StaffSectionColor;

  updateValue: <
    K extends keyof RegisterStaffValues,
  >(
    key: K,
    value: RegisterStaffValues[K],
  ) => void;
};


export function StaffContactFormSection({
  values,
  disabled = false,
  emailRequired = false,
  color = defaultStaffSectionColor,
  updateValue,
}: StaffContactFormSectionProps) {
  const fieldClassName = getStaffFieldClassName(color);

  return (
    <StaffSection
      eyebrow="Communication"
      title="Contact information"
      description="Add the primary phone number, email address and residential address."
      icon={
        <ContactRound className="h-5 w-5" />
      }
      color={color}
    >
      <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
        <StaffFormField
          label="Phone number"
          required
        >
          <input
            required
            disabled={disabled}
            dir="ltr"
            type="tel"
            autoComplete="tel"
            placeholder="+963..."
            value={values.phone_number}
            onChange={(event) =>
              updateValue(
                "phone_number",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <StaffFormField
          label="Email"
          required={emailRequired}
        >
          <input
            required={emailRequired}
            disabled={disabled}
            dir="ltr"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={values.email ?? ""}
            onChange={(event) =>
              updateValue(
                "email",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>
      </div>
    </StaffSection>
  );
}
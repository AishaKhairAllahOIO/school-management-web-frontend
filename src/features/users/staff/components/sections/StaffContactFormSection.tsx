import {
  ContactRound,
} from "lucide-react";

import {
  StaffFormField,
} from "../fields/StaffFormField";

import {
  StaffSection,
} from "../layout/StaffSection";

import type {
  RegisterStaffValues,
} from "../../types/staff.types";

const fieldClassName = [
  "h-12 w-full rounded-[16px]",
  "border border-border/70 bg-muted/25 px-4",
  "text-sm font-normal text-foreground",
  "outline-none transition duration-200",
  "placeholder:text-muted-foreground/70",
  "hover:border-primary/20 hover:bg-card",
  "focus:border-primary/35 focus:bg-card",
  "focus:ring-4 focus:ring-primary/[0.08]",
  "disabled:cursor-not-allowed",
  "disabled:opacity-60",
].join(" ");

type StaffContactFormSectionProps = {
  values: RegisterStaffValues;

  disabled?: boolean;

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
  updateValue,
}: StaffContactFormSectionProps) {
  return (
    <StaffSection
      eyebrow="Communication"
      title="Contact information"
      description="Add the primary phone number, email address and residential address."
      icon={
        <ContactRound className="h-5 w-5" />
      }
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

        <StaffFormField label="Email">
          <input
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

        <StaffFormField
          label="Address"
          required
          className="md:col-span-2"
        >
          <textarea
            required
            disabled={disabled}
            autoComplete="street-address"
            placeholder="Enter the complete address"
            value={values.address}
            onChange={(event) =>
              updateValue(
                "address",
                event.target.value,
              )
            }
            className={[
              fieldClassName,
              "min-h-28 resize-y py-3",
            ].join(" ")}
          />
        </StaffFormField>
      </div>
    </StaffSection>
  );
}
import {
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import type {
  StaffSectionColor,
} from "../../types/staff.types";

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


type StaffSecurityFormSectionProps = {
  value: string;

  disabled?: boolean;

  color?: StaffSectionColor;

  required?: boolean;

  title?: string;

  description?: string;

  helper?: string;

  onChange: (
    value: string,
  ) => void;
};

export function StaffSecurityFormSection({
  value,
  disabled = false,
  color = defaultStaffSectionColor,
  required = true,
  title = "Account access",
  description = "Create the password this staff member will use to sign in.",
  helper = "Use at least 8 characters.",
  onChange,
}: StaffSecurityFormSectionProps) {
  const fieldClassName = getStaffFieldClassName(color);

  return (
    <StaffSection
      eyebrow="Security"
      title={title}
      description={description}
      icon={
        <KeyRound className="h-5 w-5" />
      }
      color={color}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_.85fr]">
        <StaffFormField
          label="Password"
          required={required}
          helper={helper}
        >
          <input
            required={required}
            disabled={disabled}
            type="password"
            minLength={8}
            autoComplete="new-password"
            placeholder="Enter a secure password"
            value={value}
            onChange={(event) =>
              onChange(
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <article
          className={[
            "flex items-start gap-3",
            "rounded-[18px]",
            "border",
            color.border,
            color.footer,
            "p-4",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-10 w-10 shrink-0",
              "items-center justify-center",
              "rounded-[14px]",
              color.light,
              color.text,
            ].join(" ")}
          >
            <ShieldCheck className="h-5 w-5" />
          </span>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Secure account
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              The password is required for roles that can access the management system.
            </p>
          </div>
        </article>
      </div>
    </StaffSection>
  );
}
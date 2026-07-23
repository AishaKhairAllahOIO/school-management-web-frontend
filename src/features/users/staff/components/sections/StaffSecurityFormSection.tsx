import {
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import {
  StaffFormField,
} from "../fields/StaffFormField";

import {
  StaffSection,
} from "../layout/StaffSection";

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

type StaffSecurityFormSectionProps = {
  value: string;

  disabled?: boolean;

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
  required = true,
  title = "Account access",
  description = "Create the password this staff member will use to sign in.",
  helper = "Use at least 8 characters.",
  onChange,
}: StaffSecurityFormSectionProps) {
  return (
    <StaffSection
      eyebrow="Security"
      title={title}
      description={description}
      icon={
        <KeyRound className="h-5 w-5" />
      }
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
            "border border-primary/10",
            "bg-primary/[0.035]",
            "p-4",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-10 w-10 shrink-0",
              "items-center justify-center",
              "rounded-[14px]",
              "bg-primary/[0.08]",
              "text-primary",
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
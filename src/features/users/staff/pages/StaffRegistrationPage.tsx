import {
  CheckCircle2,
} from "lucide-react";

import {
  StaffPageHero,
} from "../components/layout/StaffPageHero";

import { UserPageBackButton } from "../../shared/components/UserPageBackButton";

import {
  StaffContactFormSection,
} from "../components/sections/StaffContactFormSection";

import {
  StaffEmploymentFormSection,
} from "../components/sections/StaffEmploymentFormSection";

import {
  StaffPersonalFormSection,
} from "../components/sections/StaffPersonalFormSection";

import {
  StaffPhotoFormSection,
} from "../components/sections/StaffPhotoFormSection";

import {
  StaffSecurityFormSection,
} from "../components/sections/StaffSecurityFormSection";

import {
  StaffErrorState,
} from "../components/states/StaffErrorState";

import {
  staffSectionConfigs,
} from "../config/staff.config";

import {
  useStaffRegistrationForm,
} from "../hooks/useStaffRegistrationForm";

import type {
  StaffRole,
} from "../types/staff.types";

type StaffRegistrationPageProps = {
  role: StaffRole;
};

export function StaffRegistrationPage({
  role,
}: StaffRegistrationPageProps) {
  const config =
    staffSectionConfigs[role];

  const isAdministrator =
    role === "super_admin";

  const {
    values,
    photoPreview,
    formError,
    successMessage,
    isSubmitting,
    requiresPassword,
    isServiceStaff,
    updateValue,
    handlePhotoChange,
    removePhoto,
    handleSubmit,
    handleCancel,
    clearFormError,
    clearSuccessMessage,
  } = useStaffRegistrationForm(role);

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-6 space-y-5 pb-8"
    >
      <UserPageBackButton
        label={
          isAdministrator
            ? "Back to profile"
            : `Back to ${config.pluralLabel}`
        }
        onClick={handleCancel}
      />

      <StaffPageHero
        mode="create"
        showBackButton={false}
        title={`Add ${config.singularLabel}`}
        description={
          isAdministrator
            ? "Create a protected administrator account with personal, professional and sign-in information."
            : "Create a complete staff profile and add personal, professional and account information in one place."
        }
        backLabel={
          isAdministrator
            ? "Back to profile"
            : `Back to ${config.pluralLabel}`
        }
        onBack={handleCancel}
        roleLabel={config.singularLabel}
        badgeLabel={
          isAdministrator
            ? "Super administrator"
            : "New profile"
        }
        icon={config.icon}
        color={config.color}
        showFormActions
        loading={isSubmitting}
        submitLabel={`Create ${config.singularLabel}`}
        cancelLabel="Cancel"
        onCancel={handleCancel}
      />

      {successMessage ? (
        <section
          role="status"
          className={[
            "flex items-start gap-4",
            "rounded-[22px]",
            "border border-success/20",
            "bg-success/[0.045]",
            "px-5 py-4",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-11 w-11 shrink-0",
              "items-center justify-center",
              "rounded-[14px]",
              "bg-success/[0.10]",
              "text-success",
            ].join(" ")}
          >
            <CheckCircle2
              aria-hidden="true"
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">
              Administrator created
            </h2>

            <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
              {successMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={clearSuccessMessage}
            className={[
              "shrink-0 rounded-lg px-2.5 py-1.5",
              "text-xs font-medium text-success",
              "transition hover:bg-success/[0.08]",
              "focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-success/20",
            ].join(" ")}
          >
            Dismiss
          </button>
        </section>
      ) : null}

      <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <StaffPhotoFormSection
          color={config.color}
          mode="create"
          photoUrl={photoPreview}
          disabled={isSubmitting}
          onChange={handlePhotoChange}
          onRemove={removePhoto}
        />

        <StaffPersonalFormSection
          color={config.color}
          values={values}
          disabled={isSubmitting}
          updateValue={updateValue}
        />
      </div>

      <StaffContactFormSection
        color={config.color}
        values={values}
        disabled={isSubmitting}
        emailRequired={!isServiceStaff}
        updateValue={updateValue}
      />

      <StaffEmploymentFormSection
        color={config.color}
        values={values}
        disabled={isSubmitting}
        isServiceStaff={isServiceStaff}
        updateValue={updateValue}
      />

      {requiresPassword ? (
        <StaffSecurityFormSection
          color={config.color}
          value={values.password ?? ""}
          disabled={isSubmitting}
          onChange={(password) => {
            clearFormError();
            updateValue(
              "password",
              password,
            );
          }}
        />
      ) : null}

      {formError ? (
        <StaffErrorState
          compact
          title="Unable to create profile"
          description={formError}
        />
      ) : null}
    </form>
  );
}

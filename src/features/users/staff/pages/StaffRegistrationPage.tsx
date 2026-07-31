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

  const {
    values,
    photoPreview,
    formError,
    isSubmitting,
    requiresPassword,
    isServiceStaff,
    updateValue,
    handlePhotoChange,
    removePhoto,
    handleSubmit,
    handleCancel,
    clearFormError,
  } = useStaffRegistrationForm(role);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 pb-8"
    >
      <UserPageBackButton
        label={`Back to ${config.pluralLabel}`}
        onClick={handleCancel}
      />

      <StaffPageHero
        mode="create"
        showBackButton={false}
        title={`Add ${config.singularLabel}`}
        description="Create a complete staff profile and add personal, professional and account information in one place."
        backLabel={`Back to ${config.pluralLabel}`}
        onBack={handleCancel}
        roleLabel={config.singularLabel}
        badgeLabel="New profile"
        icon={config.icon}
        color={config.color}
        showFormActions
        loading={isSubmitting}
        submitLabel={`Create ${config.singularLabel}`}
        cancelLabel="Cancel"
        onCancel={handleCancel}
      />

      <div className="grid items-start gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
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
        />      </div>


      <StaffContactFormSection
        color={config.color}
        values={values}
        disabled={isSubmitting}
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

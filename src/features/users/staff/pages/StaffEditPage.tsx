import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  StaffFormFooter,
} from "../components/layout/StaffFormFooter";

import {
  StaffPageHero,
} from "../components/layout/StaffPageHero";

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
  StaffEmptyState,
} from "../components/states/StaffEmptyState";

import {
  StaffErrorState,
} from "../components/states/StaffErrorState";

import {
  StaffPageSkeleton,
} from "../components/states/StaffPageSkeleton";

import {
  staffSectionConfigs,
} from "../config/staff.config";

import {
  useStaffDetails,
  useUpdateStaffEmployment,
  useUpdateStaffPersonal,
} from "../hooks/useStaff";

import type {
  RegisterStaffValues,
  StaffRole,
  UpdateStaffEmploymentValues,
  UpdateStaffPersonalValues,
} from "../types/staff.types";

type StaffEditPageProps = {
  role: StaffRole;
};

const emptyValues: RegisterStaffValues = {
  first_name: "",
  last_name: "",
  father_name: "",
  mother_name: "",
  phone_number: "",
  email: "",
  birth_date: "",
  birth_place: "",
  gender: "male",
  nationality: "syrian",
  address: "",
  photo_url: null,
  degree: "none",
  specialization: "",
  university: "",
  graduation_year: null,
  hire_date: "",
  experience_years: null,
  password: "",
  service_type: null,
};

export function StaffEditPage({
  role,
}: StaffEditPageProps) {
  const navigate = useNavigate();

  const { staffId } = useParams<{
    staffId: string;
  }>();

  const config =
    staffSectionConfigs[role];

  const staffQuery =
    useStaffDetails(staffId);

  const personalMutation =
    useUpdateStaffPersonal(role);

  const employmentMutation =
    useUpdateStaffEmployment(role);

  const [values, setValues] =
    useState<RegisterStaffValues>(
      emptyValues,
    );

  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [currentPhotoUrl, setCurrentPhotoUrl] =
    useState<string | null>(null);

  const [removeCurrentPhoto, setRemoveCurrentPhoto] =
    useState(false);

  const [formError, setFormError] =
    useState<string | null>(null);

  useEffect(() => {
    const staff = staffQuery.data;

    if (!staff) {
      return;
    }

    setValues({
      first_name: staff.firstName,
      last_name: staff.lastName,
      father_name: staff.fatherName,
      mother_name: staff.motherName,
      phone_number: staff.phoneNumber,
      email: staff.email ?? "",
      birth_date: staff.birthDate ?? "",
      birth_place: staff.birthPlace ?? "",
      gender: staff.gender ?? "male",
      nationality:
        staff.nationality ?? "syrian",
      address: staff.address ?? "",
      photo_url: null,
      degree: staff.degree ?? "none",
      specialization:
        staff.specialization ?? "",
      university:
        staff.university ?? "",
      graduation_year:
        staff.graduationYear,
      hire_date: staff.hireDate ?? "",
      experience_years:
        staff.experienceYears,
      password: "",
      service_type:
        staff.serviceType,
    });

    setCurrentPhotoUrl(
      staff.photoUrl ?? null,
    );

    setRemoveCurrentPhoto(false);
    setFormError(null);
  }, [staffQuery.data]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(
          photoPreview,
        );
      }
    };
  }, [photoPreview]);

  function updateValue<
    K extends keyof RegisterStaffValues,
  >(
    key: K,
    value: RegisterStaffValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview,
      );
    }

    updateValue("photo_url", file);
    setPhotoPreview(
      URL.createObjectURL(file),
    );
    setRemoveCurrentPhoto(false);
    setFormError(null);

    event.target.value = "";
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview,
      );
    }

    setPhotoPreview(null);
    setCurrentPhotoUrl(null);
    setRemoveCurrentPhoto(true);
    updateValue("photo_url", null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!staffId) {
      return;
    }

    setFormError(null);

    const personalValues: UpdateStaffPersonalValues = {
      first_name: values.first_name,
      last_name: values.last_name,
      father_name: values.father_name,
      mother_name: values.mother_name,
      phone_number: values.phone_number,
      email: values.email,
      birth_date: values.birth_date,
      birth_place: values.birth_place,
      gender: values.gender,
      nationality: values.nationality,
      address: values.address,
    };

    if (
      values.photo_url ||
      removeCurrentPhoto
    ) {
      personalValues.photo_url =
        values.photo_url ?? null;
    }

    const employmentValues: UpdateStaffEmploymentValues = {
      degree: values.degree,
      specialization:
        values.specialization,
      university: values.university,
      graduation_year:
        values.graduation_year,
      hire_date: values.hire_date,
      experience_years:
        values.experience_years,
      service_type:
        role === "service_staff"
          ? values.service_type
          : null,
    };

    try {
      await Promise.all([
        personalMutation.mutateAsync({
          staffId,
          values: personalValues,
        }),
        employmentMutation.mutateAsync({
          staffId,
          values: employmentValues,
        }),
      ]);

      navigate(
        `${config.listPath}/${staffId}`,
      );
    } catch {
      setFormError(
        "The changes could not be saved. Check the entered information and try again.",
      );
    }
  }

  if (staffQuery.isPending) {
    return (
      <StaffPageSkeleton mode="form" />
    );
  }

  if (!staffId) {
    return (
      <StaffEmptyState
        title="Staff identifier missing"
        description="The staff identifier is missing from the page address, so the profile cannot be edited."
        actionLabel={`Back to ${config.pluralLabel}`}
        onAction={() =>
          navigate(config.listPath)
        }
      />
    );
  }

  if (staffQuery.isError) {
    return (
      <StaffErrorState
        title="Unable to load staff profile"
        description={`The ${config.singularLabel.toLowerCase()} profile could not be loaded for editing.`}
        actionLabel="Try again"
        onRetry={() => {
          void staffQuery.refetch();
        }}
      />
    );
  }

  if (!staffQuery.data) {
    return (
      <StaffEmptyState
        title="Staff profile not found"
        description={`The requested ${config.singularLabel.toLowerCase()} profile does not exist or may have been removed.`}
        actionLabel={`Back to ${config.pluralLabel}`}
        onAction={() =>
          navigate(config.listPath)
        }
      />
    );
  }

  const staff = staffQuery.data;

  const isSaving =
    personalMutation.isPending ||
    employmentMutation.isPending;

  const visiblePhoto =
    photoPreview ??
    (!removeCurrentPhoto
      ? currentPhotoUrl
      : null);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 pb-28"
    >
      <StaffPageHero
        mode="edit"
        title={`Edit ${staff.fullName}`}
        description={`Update the ${config.singularLabel.toLowerCase()}'s personal and employment information.`}
        backLabel={`Back to ${config.singularLabel.toLowerCase()}`}
        
        onBack={() =>
          navigate(
            `${config.listPath}`,
          )
        }
        photoUrl={visiblePhoto}
        photoAlt={staff.fullName}
        roleLabel={config.singularLabel}
        badgeLabel="Edit profile"
      />

      <StaffPhotoFormSection
        mode="edit"
        photoUrl={visiblePhoto}
        disabled={isSaving}
        onChange={handlePhotoChange}
        onRemove={removePhoto}
      />

      <StaffPersonalFormSection
        values={values}
        disabled={isSaving}
        updateValue={updateValue}
      />

      <StaffContactFormSection
        values={values}
        disabled={isSaving}
        updateValue={updateValue}
      />

      <StaffEmploymentFormSection
        values={values}
        disabled={isSaving}
        isServiceStaff={
          role === "service_staff"
        }
        updateValue={updateValue}
      />

      {formError ? (
        <StaffErrorState
          compact
          title="Unable to save changes"
          description={formError}
        />
      ) : null}

      <StaffFormFooter
        loading={isSaving}
        submitLabel="Save changes"
        hint="Review the updated information before saving."
        onCancel={() =>
          navigate(
            `${config.listPath}/${staffId}`,
          )
        }
      />
    </form>
  );
}

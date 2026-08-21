import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  staffSectionConfigs,
} from "../config/staff.config";

import {
  useRegisterStaff,
} from "./useStaff";

import type {
  RegisterStaffValues,
  StaffRole,
} from "../types/staff.types";

function createInitialValues(): RegisterStaffValues {
  return {
    first_name: "",
    last_name: "",
    father_name: "",
    mother_name: "",

    phone_number: "",
    email: "",

    birth_date: "",
    birth_place: "",

    gender: null,
    nationality: null,

    address: "",
    photo_url: null,

    degree: null,
    specialization: "",
    university: "",
    graduation_year: null,

    hire_date: "",
    experience_years: null,

    password: "",
    service_type: null,
  };
}

type UseStaffRegistrationFormResult = {
  values: RegisterStaffValues;

  photoPreview: string | null;
  formError: string | null;
  successMessage: string | null;

  isSubmitting: boolean;
  requiresPassword: boolean;
  isServiceStaff: boolean;

  updateValue: <
    K extends keyof RegisterStaffValues,
  >(
    key: K,
    value: RegisterStaffValues[K],
  ) => void;

  handlePhotoChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;

  removePhoto: () => void;

  handleSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => Promise<void>;

  handleCancel: () => void;

  clearFormError: () => void;
  clearSuccessMessage: () => void;
};

export function useStaffRegistrationForm(
  role: StaffRole,
): UseStaffRegistrationFormResult {
  const navigate = useNavigate();

  const config =
    staffSectionConfigs[role];

  const registerMutation =
    useRegisterStaff(role);

  const [values, setValues] =
    useState<RegisterStaffValues>(
      createInitialValues,
    );

  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(
          photoPreview,
        );
      }
    };
  }, [photoPreview]);

  const clearPhotoPreview = useCallback(() => {
    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview,
      );
    }

    setPhotoPreview(null);
  }, [photoPreview]);

  const updateValue = useCallback(
    <
      K extends keyof RegisterStaffValues,
    >(
      key: K,
      value: RegisterStaffValues[K],
    ) => {
      setFormError(null);
      setSuccessMessage(null);

      setValues((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  const handlePhotoChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target.files?.[0] ??
        null;

      if (photoPreview) {
        URL.revokeObjectURL(
          photoPreview,
        );
      }

      setFormError(null);
      setSuccessMessage(null);

      setValues((current) => ({
        ...current,
        photo_url: file,
      }));

      setPhotoPreview(
        file
          ? URL.createObjectURL(file)
          : null,
      );

      event.target.value = "";
    },
    [photoPreview],
  );

  const removePhoto = useCallback(() => {
    clearPhotoPreview();

    setValues((current) => ({
      ...current,
      photo_url: null,
    }));

    setFormError(null);
    setSuccessMessage(null);
  }, [clearPhotoPreview]);

  const handleSubmit = useCallback(
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setFormError(null);
      setSuccessMessage(null);

      try {
        const createdStaff =
          await registerMutation.mutateAsync(
            values,
          );

        if (role === "super_admin") {
          clearPhotoPreview();
          setValues(createInitialValues());
          setSuccessMessage(
            `${createdStaff.fullName || "The administrator"} was registered successfully. The form is ready for another administrator.`,
          );

          window.requestAnimationFrame(() => {
            const firstField = document.querySelector<HTMLInputElement>(
              'input[name="first_name"]',
            );

            firstField?.focus();
          });

          return;
        }

        navigate(
          `${config.listPath}/${createdStaff.id}`,
        );
      } catch {
        setFormError(
          `The ${config.singularLabel.toLowerCase()} could not be created. Check the entered information and try again.`,
        );
      }
    },
    [
      clearPhotoPreview,
      config.listPath,
      config.singularLabel,
      navigate,
      registerMutation,
      role,
      values,
    ],
  );

  const handleCancel =
    useCallback(() => {
      navigate(config.listPath);
    }, [
      config.listPath,
      navigate,
    ]);

  const clearFormError =
    useCallback(() => {
      setFormError(null);
    }, []);

  const clearSuccessMessage =
    useCallback(() => {
      setSuccessMessage(null);
    }, []);

  const requiresPassword =
    role === "adviser" ||
    role === "secretary" ||
    role === "super_admin";

  const isServiceStaff =
    role === "service_staff";

  return {
    values,

    photoPreview,
    formError,
    successMessage,

    isSubmitting:
      registerMutation.isPending,

    requiresPassword,
    isServiceStaff,

    updateValue,

    handlePhotoChange,
    removePhoto,

    handleSubmit,
    handleCancel,

    clearFormError,
    clearSuccessMessage,
  };
}

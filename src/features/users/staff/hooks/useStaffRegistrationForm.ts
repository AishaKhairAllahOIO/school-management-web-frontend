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

const initialStaffRegistrationValues: RegisterStaffValues = {
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

type UseStaffRegistrationFormResult = {
  values: RegisterStaffValues;

  photoPreview: string | null;
  formError: string | null;

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
      initialStaffRegistrationValues,
    );

  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [formError, setFormError] =
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

  const updateValue = useCallback(
    <
      K extends keyof RegisterStaffValues,
    >(
      key: K,
      value: RegisterStaffValues[K],
    ) => {
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

      updateValue(
        "photo_url",
        file,
      );

      setPhotoPreview(
        file
          ? URL.createObjectURL(file)
          : null,
      );

      event.target.value = "";
    },
    [
      photoPreview,
      updateValue,
    ],
  );

  const removePhoto = useCallback(() => {
    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview,
      );
    }

    updateValue(
      "photo_url",
      null,
    );

    setPhotoPreview(null);
  }, [
    photoPreview,
    updateValue,
  ]);

  const handleSubmit = useCallback(
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setFormError(null);

      try {
        const createdStaff =
          await registerMutation.mutateAsync(
            values,
          );

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
      config.listPath,
      config.singularLabel,
      navigate,
      registerMutation,
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

  const requiresPassword =
    role === "adviser" ||
    role === "secretary";

  const isServiceStaff =
    role === "service_staff";

  return {
    values,

    photoPreview,
    formError,

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
  };
}
import type {
  RegisterStudentPayload,
  UpdateEnrollmentPayload,
  UpdateGuardianPersonalPayload,
  UpdateStudentPersonalPayload,
} from "../types/student.types";

type FormDataValue =
  | string
  | number
  | boolean
  | File
  | null
  | undefined;

type FormDataRecord = Record<string, FormDataValue>;

const appendObjectToFormData = (
  formData: FormData,
  prefix: string,
  values: FormDataRecord,
): void => {
  Object.entries(values).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return;
    }

    const fieldName = `${prefix}[${key}]`;

    if (value instanceof File) {
      formData.append(fieldName, value);
      return;
    }

    formData.append(fieldName, String(value));
  });
};

export const createStudentRegistrationFormData = (
  payload: RegisterStudentPayload,
): FormData => {
  const formData = new FormData();

  appendObjectToFormData(
    formData,
    "student",
    payload.student as FormDataRecord,
  );

  appendObjectToFormData(
    formData,
    "guardian",
    payload.guardian as FormDataRecord,
  );

  appendObjectToFormData(
    formData,
    "enrollment",
    payload.enrollment as FormDataRecord,
  );

  return formData;
};

export const createStudentUpdateFormData = (
  payload: UpdateStudentPersonalPayload,
): FormData => {
  const formData = new FormData();

  appendObjectToFormData(
    formData,
    "student",
    payload as FormDataRecord,
  );

  return formData;
};

export const createGuardianUpdateFormData = (
  payload: UpdateGuardianPersonalPayload,
): FormData => {
  const formData = new FormData();

  appendObjectToFormData(
    formData,
    "guardian",
    payload as FormDataRecord,
  );

  return formData;
};

export const createEnrollmentUpdateFormData = (
  payload: UpdateEnrollmentPayload,
): FormData => {
  const formData = new FormData();

  appendObjectToFormData(
    formData,
    "enrollment",
    payload as FormDataRecord,
  );

  return formData;
};
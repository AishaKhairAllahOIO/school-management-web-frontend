import type {
  GuardianPersonalPayload,
  RegisterStudentPayload,
  StudentPersonalPayload,
  UpdateGuardianPersonalPayload,
  UpdateStudentPersonalPayload,
} from "../types/student.types";

type FormDataPrimitive =
  | string
  | number
  | boolean
  | File
  | null
  | undefined;

function appendValue(
  formData: FormData,
  key: string,
  value: FormDataPrimitive,
): void {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return;
  }

  if (value instanceof File) {
    formData.append(key, value);
    return;
  }

  formData.append(key, String(value));
}

function appendNestedRecord(
  formData: FormData,
  prefix: string,
  values: Record<string, FormDataPrimitive>,
): void {
  Object.entries(values).forEach(([key, value]) => {
    appendValue(
      formData,
      `${prefix}[${key}]`,
      value,
    );
  });
}

export function buildStudentRegistrationFormData(
  payload: RegisterStudentPayload,
): FormData {
  const formData = new FormData();

  appendNestedRecord(
    formData,
    "student",
    payload.student,
  );

  appendNestedRecord(
    formData,
    "guardian",
    payload.guardian,
  );

  appendNestedRecord(
    formData,
    "enrollment",
    payload.enrollment,
  );

  return formData;
}

export function buildStudentPersonalFormData(
  payload:
    | StudentPersonalPayload
    | UpdateStudentPersonalPayload,
): FormData {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    appendValue(
      formData,
      key,
      value as FormDataPrimitive,
    );
  });

  return formData;
}

export function buildGuardianPersonalFormData(
  payload:
    | GuardianPersonalPayload
    | UpdateGuardianPersonalPayload,
): FormData {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    appendValue(
      formData,
      key,
      value as FormDataPrimitive,
    );
  });

  return formData;
}
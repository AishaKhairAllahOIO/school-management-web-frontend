import type {
  PersonRegistrationInput,
  RegisterStudentPayload,
  UpdateGuardianPersonalPayload,
  UpdateStudentPersonalPayload,
} from "../types/student-api.types";

type PersonalUpdatePayload =
  | UpdateStudentPersonalPayload
  | UpdateGuardianPersonalPayload;

const personFieldMap: Record<
  Exclude<keyof PersonRegistrationInput, "photo">,
  string
> = {
  phoneNumber: "phone_number",
  firstName: "first_name",
  lastName: "last_name",
  fatherName: "father_name",
  motherName: "mother_name",
  birthDate: "birth_date",
  birthPlace: "birth_place",
  address: "address",
  gender: "gender",
  nationality: "nationality",
};

function appendValue(
  formData: FormData,
  key: string,
  value: unknown,
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

function appendPerson(
  formData: FormData,
  prefix: "student" | "guardian",
  person: PersonRegistrationInput,
): void {
  for (const [clientKey, apiKey] of Object.entries(
    personFieldMap,
  )) {
    appendValue(
      formData,
      `${prefix}[${apiKey}]`,
      person[clientKey as keyof PersonRegistrationInput],
    );
  }

  appendValue(
    formData,
    `${prefix}[photo]`,
    person.photo,
  );
}

export function createRegisterStudentFormData(
  payload: RegisterStudentPayload,
): FormData {
  const formData = new FormData();

  appendPerson(formData, "student", payload.student);
  appendPerson(formData, "guardian", payload.guardian);

  appendValue(
    formData,
    "enrollment[academic_year_id]",
    payload.enrollment.academicYearId,
  );

  appendValue(
    formData,
    "enrollment[grade_level_id]",
    payload.enrollment.gradeLevelId,
  );

  appendValue(
    formData,
    "enrollment[class_room_id]",
    payload.enrollment.classroomId,
  );

  return formData;
}

export function createPersonalUpdateFormData(
  payload: PersonalUpdatePayload,
): FormData {
  const formData = new FormData();

  for (const [clientKey, apiKey] of Object.entries(
    personFieldMap,
  )) {
    appendValue(
      formData,
      apiKey,
      payload[clientKey as keyof PersonalUpdatePayload],
    );
  }

  appendValue(formData, "photo", payload.photo);

  return formData;
}

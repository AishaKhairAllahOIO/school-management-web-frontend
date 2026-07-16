import { appendFormDataRecord } from "../../shared/api/form-data.utils";
import type { RegisterStudentFormValues } from "../types/student.types";

export function buildStudentRegistrationFormData(
  values: RegisterStudentFormValues,
): FormData {
  const formData = new FormData();
  appendFormDataRecord(formData, values.guardian, "guardian");
  appendFormDataRecord(formData, values.student, "student");
  appendFormDataRecord(formData, values.enrollment, "enrollment");
  return formData;
}

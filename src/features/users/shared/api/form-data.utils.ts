type FormDataValue = string | number | boolean | File | null | undefined;

export function appendFormDataRecord(
  formData: FormData,
  values: Record<string, FormDataValue>,
  namespace?: string,
): void {
  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    const fieldName = namespace ? `${namespace}[${key}]` : key;
    formData.append(fieldName, value instanceof File ? value : String(value));
  });
}

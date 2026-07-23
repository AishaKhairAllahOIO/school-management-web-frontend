type FormDataPrimitive =
  | string
  | number
  | boolean
  | File
  | Blob
  | Date
  | null
  | undefined;

type FormDataValue =
  | FormDataPrimitive
  | FormDataValue[]
  | Record<string, unknown>;

function isFileOrBlob(
  value: unknown,
): value is File | Blob {
  return (
    value instanceof File ||
    value instanceof Blob
  );
}

export function appendFormDataValue(
  formData: FormData,
  key: string,
  value: FormDataValue,
): void {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return;
  }

  if (isFileOrBlob(value)) {
    formData.append(key, value);
    return;
  }

  if (value instanceof Date) {
    formData.append(
      key,
      value.toISOString(),
    );

    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      appendFormDataValue(
        formData,
        `${key}[${index}]`,
        item,
      );
    });

    return;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(
      ([nestedKey, nestedValue]) => {
        appendFormDataValue(
          formData,
          `${key}[${nestedKey}]`,
          nestedValue as FormDataValue,
        );
      },
    );

    return;
  }

  if (typeof value === "boolean") {
    formData.append(
      key,
      value ? "1" : "0",
    );

    return;
  }

  formData.append(
    key,
    String(value),
  );
}

export function objectToFormData(
  values: Record<string, unknown>,
): FormData {
  const formData = new FormData();

  Object.entries(values).forEach(
    ([key, value]) => {
      appendFormDataValue(
        formData,
        key,
        value as FormDataValue,
      );
    },
  );

  return formData;
}

export function appendNestedObject(
  formData: FormData,
  namespace: string,
  values: Record<string, unknown>,
): void {
  Object.entries(values).forEach(
    ([key, value]) => {
      appendFormDataValue(
        formData,
        `${namespace}[${key}]`,
        value as FormDataValue,
      );
    },
  );
}

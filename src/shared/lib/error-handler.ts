import axios from "axios";

import { notify } from "./toast";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export function handleApiError(error: unknown) {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    notify.error("Unexpected error occurred");
    return;
  }

  const response = error.response?.data;

  if (response?.message) {
    notify.error(response.message);
    return;
  }

  const firstValidationError = response?.errors
    ? Object.values(response.errors).flat()[0]
    : undefined;

  if (firstValidationError) {
    notify.error(firstValidationError);
    return;
  }

  notify.error("Something went wrong");
}
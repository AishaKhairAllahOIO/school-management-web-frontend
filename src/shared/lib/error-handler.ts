import axios from "axios";

import type {
  ApiValidationErrors,
  LaravelErrorResponse,
} from "@/services/types/apiResponse";

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

function isLaravelErrorResponse(
  value: unknown,
): value is LaravelErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    ("message" in value || "errors" in value)
  );
}

export function extractApiValidationErrors(
  error: unknown,
): ApiValidationErrors {
  if (!axios.isAxiosError(error)) {
    return {};
  }

  const responseData: unknown = error.response?.data;

  if (!isLaravelErrorResponse(responseData)) {
    return {};
  }

  return responseData.errors ?? {};
}

export function extractApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error.message
      : DEFAULT_ERROR_MESSAGE;
  }

  const responseData: unknown = error.response?.data;

  if (isLaravelErrorResponse(responseData)) {
    const validationErrors = responseData.errors;

    if (validationErrors) {
      const firstMessages = Object.values(validationErrors);
      const firstMessage = firstMessages[0]?.[0];

      if (firstMessage) {
        return firstMessage;
      }
    }

    if (responseData.message) {
      return responseData.message;
    }
  }

  return error.message || DEFAULT_ERROR_MESSAGE;
}
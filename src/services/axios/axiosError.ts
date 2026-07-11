import {
  extractApiErrorMessage,
  extractApiValidationErrors,
} from "@/shared/lib/error-handler";

export function getAxiosErrorMessage(error: unknown): string {
  return extractApiErrorMessage(error);
}

export function getAxiosValidationErrors(error: unknown) {
  return extractApiValidationErrors(error);
}
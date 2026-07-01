import type { AxiosError } from "axios";
import type { LaravelErrorResponse } from "@/services/types/apiResponse";

export function extractApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<LaravelErrorResponse>;
  const errors = axiosError.response?.data?.errors;

  if (errors) {
    const firstField = Object.keys(errors)[0];
    const firstMessage = errors[firstField]?.[0];
    if (firstMessage) return firstMessage;
  }

  return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || "Something went wrong. Please try again.";
}

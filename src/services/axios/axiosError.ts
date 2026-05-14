import { AxiosError } from "axios";

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

export function getAxiosErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    "Something went wrong"
  );
}
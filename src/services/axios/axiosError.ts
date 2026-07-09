import { extractApiErrorMessage } from "@/shared/lib/error-handler";

export function getAxiosErrorMessage(error: unknown): string
{
  return extractApiErrorMessage(error);
}
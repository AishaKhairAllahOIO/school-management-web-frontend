import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

type UnknownRecord = Record<string, unknown>;

function collectMessages(value: unknown, result: string[] = []): string[] {
  if (typeof value === "string") {
    const message = value.trim();
    if (message) result.push(message);
    return result;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectMessages(item, result));
    return result;
  }

  if (value && typeof value === "object") {
    const record = value as UnknownRecord;

    if ("message" in record) {
      collectMessages(record.message, result);
    }

    if ("errors" in record) {
      collectMessages(record.errors, result);
    }

    if ("error" in record) {
      collectMessages(record.error, result);
    }

    if (
      result.length === 0 &&
      "data" in record
    ) {
      collectMessages(record.data, result);
    }

    if (result.length === 0) {
      Object.values(record).forEach((item) =>
        collectMessages(item, result),
      );
    }
  }

  return result;
}

function getServerErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const messages = collectMessages(
      error.response?.data,
    );

    if (messages.length > 0) {
      return [...new Set(messages)].join("\n");
    }
  }

  const messages = collectMessages(error);

  if (messages.length > 0) {
    return [...new Set(messages)].join("\n");
  }

  return "Something went wrong. Please try again.";
}

function getStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }

  return undefined;
}

export function useServerErrorLayer() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let lastErrorSignature = "";

    const showError = (error: unknown) => {
      const status = getStatus(error);

      if (
        status !== 409 &&
        status !== 422 &&
        status !== 500
      ) {
        return;
      }

      const message = getServerErrorMessage(error);
      const signature = `${status}:${message}`;

      if (signature === lastErrorSignature) {
        return;
      }

      lastErrorSignature = signature;

      toast.error(message, {
        duration: 7000,
      });
    };

    const queryCacheUnsubscribe =
      queryClient.getQueryCache().subscribe((event) => {
        if (event.type === "updated" && event.query.state.error) {
          showError(event.query.state.error);
        }
      });

    const mutationCacheUnsubscribe =
      queryClient.getMutationCache().subscribe((event) => {
        if (
          event.type === "updated" &&
          event.mutation.state.error
        ) {
          showError(event.mutation.state.error);
        }
      });

    return () => {
      queryCacheUnsubscribe();
      mutationCacheUnsubscribe();
    };
  }, [queryClient]);

}

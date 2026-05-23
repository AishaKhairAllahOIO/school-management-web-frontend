import axios from "axios";

import { notify } from "./toast";

export const handleApiError = (
  error: unknown
) => {

  if (!axios.isAxiosError(error)) {

    notify.error(
      "Unexpected error occurred"
    );

    return;
  }

  const response =
    error.response?.data;

  // backend message
  if (response?.message) {

    notify.error(response.message);

    return;
  }

  // validation errors
  if (response?.errors) {

    const firstError =
      Object.values(response.errors)
        .flat()[0];

    if (firstError) {

      notify.error(
        String(firstError)
      );

      return;
    }
  }

  notify.error(
    "Something went wrong"
  );
};
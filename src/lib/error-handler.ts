import axios from "axios";

import { notify }
from "@/shared/lib/toast";
import { ERROR_CODES }
from "@/shared/constants/error-codes";
import { ERROR_MESSAGES }
from "@/shared/constants/error-messages";


export const handleApiError = (
  error: unknown
): void => {

  if (!axios.isAxiosError(error)) {

    notify.error(
      ERROR_MESSAGES
        .GENERAL
        .UNEXPECTED_ERROR
    );

    return;
  }

  if (!error.response) {

    notify.error(
      ERROR_MESSAGES
        .GENERAL
        .NETWORK_ERROR
    );

    return;
  }

  const status =
    error.response.status;

  const backendMessage =
    error.response.data?.message;

  if (backendMessage) {

    notify.error(
      backendMessage
    );

    return;
  }

  switch (status) {

    case ERROR_CODES.BAD_REQUEST:

      notify.error(
        ERROR_MESSAGES
          .GENERAL
          .DEFAULT
      );

      break;

    case ERROR_CODES.UNAUTHORIZED:

      notify.error(
        ERROR_MESSAGES
          .AUTH
          .UNAUTHORIZED
      );

      break;

    case ERROR_CODES.FORBIDDEN:

      notify.error(
        ERROR_MESSAGES
          .AUTH
          .ACCESS_DENIED
      );

      break;

    case ERROR_CODES.NOT_FOUND:

      notify.error(
        ERROR_MESSAGES
          .GENERAL
          .DEFAULT
      );

      break;

    case ERROR_CODES.SERVER_ERROR:

      notify.error(
        ERROR_MESSAGES
          .GENERAL
          .SERVER_ERROR
      );

      break;

    default:

      notify.error(
        ERROR_MESSAGES
          .GENERAL
          .DEFAULT
      );
  }
};
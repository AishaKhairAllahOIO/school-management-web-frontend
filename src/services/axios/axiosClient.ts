import axios from "axios";

import { env } from "@/config";
import { AUTH_ROUTES } from "@/features/auth/constants/auth.constants";
import { authStorage } from "@/features/auth/lib/auth.storage";

let isHandlingUnauthorized = false;

export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

function containsAuthenticationRouteError(
  value: unknown,
): boolean {
  if (typeof value === "string") {
    return (
      value.includes("Route [login] not defined") ||
      value.includes("Unauthenticated")
    );
  }

  if (typeof value !== "object" || value === null) {
    return false;
  }

  return Object.values(value).some((item) =>
    containsAuthenticationRouteError(item),
  );
}

function isAuthenticationFailure(
  status: number | undefined,
  responseData: unknown,
): boolean {
  if (status === 401) {
    return true;
  }

  return (
    status === 500 &&
    containsAuthenticationRouteError(responseData)
  );
}

function redirectToLogin(): void {
  if (isHandlingUnauthorized) {
    return;
  }

  isHandlingUnauthorized = true;

  authStorage.clear();

  const currentPath = `${window.location.pathname}${window.location.search}`;

  const loginUrl = new URL(
    AUTH_ROUTES.LOGIN,
    window.location.origin,
  );

  if (
    currentPath &&
    !currentPath.startsWith(AUTH_ROUTES.LOGIN)
  ) {
    loginUrl.searchParams.set("redirect", currentPath);
  }

  window.location.replace(loginUrl.toString());
}

axiosClient.interceptors.response.use(
  (response) => response,

  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const responseData: unknown =
      error.response?.data;

    const isAuthPage =
      window.location.pathname.startsWith("/auth");

    if (
      !isAuthPage &&
      isAuthenticationFailure(status, responseData)
    ) {
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);
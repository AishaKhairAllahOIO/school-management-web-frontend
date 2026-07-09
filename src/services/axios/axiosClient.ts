import axios from "axios";
import { env } from "@/config";
import { authStorage } from "@/features/auth/lib/auth.storage";
import { AUTH_ROUTES } from "@/features/auth/constants/auth.constants";

export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isAuthRoute = window.location.pathname.startsWith("/auth");
    if (status === 401 && !isAuthRoute) {
      authStorage.clear();
      window.location.replace(AUTH_ROUTES.LOGIN);
    }
    return Promise.reject(error);
  }
);
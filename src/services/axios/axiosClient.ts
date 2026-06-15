import axios from "axios";

import  { env } from "@/app/config";
import { setupAxiosInterceptors } from "./axiosInterceptors";

export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

setupAxiosInterceptors(axiosClient);
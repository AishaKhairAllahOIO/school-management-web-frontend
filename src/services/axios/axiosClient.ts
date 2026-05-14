import axios from "axios";
import { setupAxiosInterceptors } from "./axiosInterceptors";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

setupAxiosInterceptors(axiosClient);
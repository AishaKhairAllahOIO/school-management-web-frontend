import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";

import type {
  DashboardProfileUser,
} from "../types/profile.types";


export async function getMyProfile(): Promise<DashboardProfileUser> {
  const response =
    await axiosClient.get(
      API_ENDPOINTS.STAFF.PROFILE,
    );

  return response.data.data;
}
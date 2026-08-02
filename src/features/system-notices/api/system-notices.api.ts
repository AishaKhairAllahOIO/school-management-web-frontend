import {
  API_ENDPOINTS,
} from "@/services/api/endpoints";
import {
  axiosClient,
} from "@/services/axios/axiosClient";
import type {
  ApiResponse,
} from "@/services/types/apiResponse";

import type {
  SystemNoticesResponse,
  UnreadSystemNoticesCount,
} from "../types/system-notice.types";

export const systemNoticesApi = {
  list(page = 1) {
    return axiosClient.get<SystemNoticesResponse>(
      API_ENDPOINTS.SYSTEM_NOTICES.LIST,
      {
        params: {
          page,
        },
      },
    );
  },

  unreadCount() {
    return axiosClient.get<
      ApiResponse<UnreadSystemNoticesCount>
    >(
      API_ENDPOINTS.SYSTEM_NOTICES
        .UNREAD_COUNT,
    );
  },

  markAllRead() {
    return axiosClient.post<
      ApiResponse<UnreadSystemNoticesCount>
    >(
      API_ENDPOINTS.SYSTEM_NOTICES
        .MARK_ALL_READ,
    );
  },
};

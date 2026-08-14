import { axiosClient } from "@/services/axios/axiosClient";

export type UpdateContentPayload = {
  key: string;
  value: string | null;
};

export type UpdateContentResponse = {
  success: boolean;
  content: {
    id: number;
    key: string;
    value: string | null;
    created_at: string;
    updated_at: string;
  };
};

export async function updateContent(
  payload: UpdateContentPayload,
): Promise<UpdateContentResponse> {
  const response = await axiosClient.post<UpdateContentResponse>(
    "/content",
    payload,
  );

  return response.data;
}
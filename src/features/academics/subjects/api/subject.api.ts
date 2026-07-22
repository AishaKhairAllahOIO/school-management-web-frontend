import axios from "axios";

import {
  axiosClient,
} from "@/services/axios/axiosClient";

import type {
  ApiId,
  ApiResponse,
} from "../../shared/types/api.types";

import type {
  CreateSubjectPayload,
  Subject,
  SubjectApiItem,
  UpdateSubjectPayload,
} from "../types/subject.types";

import {
  subjectEndpoints,
} from "./subject.endpoints";

function unwrapResponse<T>(
  response: ApiResponse<T> | T,
): T {
  if (
    typeof response === "object" &&
    response !== null &&
    "data" in response
  ) {
    return (
      response as ApiResponse<T>
    ).data;
  }

  return response as T;
}

function mapSubject(
  item: SubjectApiItem,
): Subject {
  return {
    id: String(item.id),

    name:
      item.name ??
      item.subjectName ??
      item.subject_name ??
      "",

    createdAt:
      item.createdAt ??
      item.created_at ??
      "",

    updatedAt:
      item.updatedAt ??
      item.updated_at ??
      "",
  };
}

function logSubjectApiError(
  action: string,
  error: unknown,
): void {
  if (axios.isAxiosError(error)) {
    console.error(
      `[Subjects API] ${action} failed`,
      {
        status:
          error.response?.status,

        data:
          error.response?.data,

        url:
          error.config?.url,

        method:
          error.config?.method,
      },
    );

    return;
  }

  console.error(
    `[Subjects API] ${action} failed`,
    error,
  );
}

export const subjectApi = {
  async list():
    Promise<Subject[]> {
    try {
      const response =
        await axiosClient.get<
          | ApiResponse<SubjectApiItem[]>
          | SubjectApiItem[]
        >(
          subjectEndpoints.list,
        );

      const data =
        unwrapResponse(
          response.data,
        );

      return data.map(
        mapSubject,
      );
    } catch (error) {
      logSubjectApiError(
        "list",
        error,
      );

      throw error;
    }
  },

  async create(
    values:
      CreateSubjectPayload,
  ): Promise<Subject> {
    try {
      const name =
        values.name.trim();

      if (!name) {
        throw new Error(
          "Subject name is required.",
        );
      }

      const response =
        await axiosClient.post<
          | ApiResponse<SubjectApiItem>
          | SubjectApiItem
        >(
          subjectEndpoints.create,
          {
            subject_name: name,
          },
        );

      const data =
        unwrapResponse(
          response.data,
        );

      return mapSubject(data);
    } catch (error) {
      logSubjectApiError(
        "create",
        error,
      );

      throw error;
    }
  },

  async update(
    subjectId: ApiId,
    values:
      UpdateSubjectPayload,
  ): Promise<Subject> {
    try {
      const payload: {
        subject_name?: string;
      } = {};

      if (
        values.name !== undefined
      ) {
        payload.subject_name =
          values.name.trim();
      }

      const response =
        await axiosClient.post<
          | ApiResponse<SubjectApiItem>
          | SubjectApiItem
        >(
          subjectEndpoints.update(
            subjectId,
          ),
          payload,
        );

      const data =
        unwrapResponse(
          response.data,
        );

      return mapSubject(data);
    } catch (error) {
      logSubjectApiError(
        "update",
        error,
      );

      throw error;
    }
  },

  async remove(
    subjectId: ApiId,
  ): Promise<void> {
    try {
      await axiosClient.delete(
        subjectEndpoints.remove(
          subjectId,
        ),
      );
    } catch (error) {
      logSubjectApiError(
        "remove",
        error,
      );

      throw error;
    }
  },
};
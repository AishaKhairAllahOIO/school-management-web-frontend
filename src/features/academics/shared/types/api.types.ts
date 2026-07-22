export type ApiId = string | number;

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  error?: string | null;
};
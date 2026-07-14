export type ApiResponse<T> = {
  success: boolean;

  message: string;

  data: T;
};

export type PaginatedResponse<T> = {
  success: boolean;

  message: string;

  data: T[];

  total: number;

  page: number;

  pageSize: number;
};
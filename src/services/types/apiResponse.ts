export type ApiResponse<T = unknown> = {
  status: boolean;
  message: string;
  data?: T;
};

export type LaravelValidationErrors = Record<string, string[]>;

export type LaravelErrorResponse = {
  message?: string;
  error?: string;
  errors?: LaravelValidationErrors;
};

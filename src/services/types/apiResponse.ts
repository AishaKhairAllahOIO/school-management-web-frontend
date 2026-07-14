export type ApiValidationErrors = Record<string, string[]>;

export type ApiResponse<TData = undefined> = {
  status: boolean;
  message?: string;
  data?: TData;
  errors?: ApiValidationErrors;
};

export type LaravelErrorResponse = {
  status?: false;
  message: string;
  errors?: ApiValidationErrors;
};
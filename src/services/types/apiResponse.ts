export type ApiResponse<T = unknown> = 
{
  status: boolean;
  message?: string;
  data?: T;
};

export type ApiValidationErrors = Record<string, string[]>;
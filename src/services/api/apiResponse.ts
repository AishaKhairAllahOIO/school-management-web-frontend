export type ApiResponse<T> = {

  status: boolean;

  message?: string;

  data: T;
};

export type PaginatedResponse<T> = 
{
  data: T[];
  meta: 
  {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
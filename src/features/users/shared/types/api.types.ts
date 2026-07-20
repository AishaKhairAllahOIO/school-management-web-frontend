export type ApiId = string | number;

export type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type ApiMessageResponse = {
  status: boolean;
  message: string;
};

export type PaginationLinks = {
  first: string | null;
  last?: string | null;
  prev?: string | null;
  next: string | null;
};

export type PaginationMeta = {
  current_page: number;
  from?: number | null;
  last_page: number;
  path?: string;
  per_page: number;
  to?: number | null;
  total: number;
};

export type PaginatedData<T> = {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
};

export type PaginatedApiResponse<T> =
  ApiResponse<PaginatedData<T>>;

export type SortDirection = "asc" | "desc";

export type LaravelValidationErrors =
  Record<string, string[]>;

export type LaravelValidationErrorResponse = {
  message: string;
  errors: LaravelValidationErrors;
};

export type ImportBatchStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type ImportBatchCreatedData = {
  batch_id: ApiId;
};

export type ImportBatchProgress = {
  batchId?: ApiId;
  batch_id?: ApiId;

  status: ImportBatchStatus;

  totalRows?: number;
  total_rows?: number;

  processedRows?: number;
  processed_rows?: number;

  successfulRows?: number;
  successful_rows?: number;

  failedRows?: number;
  failed_rows?: number;

  progress?: number;

  message?: string;
};

export type Nullable<T> = T | null;
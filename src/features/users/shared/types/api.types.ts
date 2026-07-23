export type ApiId =
  | string
  | number;

export type ApiStatus =
  | boolean
  | string
  | number;

export type ApiResponse<T> = {
  success?: boolean;
  status?: ApiStatus;
  message?: string;
  data: T;
};

export type ApiMessageResponse = {
  success?: boolean;
  status?: ApiStatus;
  message: string;
};

export type PaginationLinks = {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
};

export type PaginationMeta = {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
};

export type PaginatedData<T> = {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
};

export type LaravelPaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type LaravelPaginationResponse<T> = {
  data: T[];

  current_page: number;
  first_page_url: string;
  from: number | null;

  last_page: number;
  last_page_url: string;

  links: LaravelPaginationLink[];

  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;

  to: number | null;
  total: number;
};

export type ValidationErrors =
  Record<string, string[]>;

export type ApiValidationError = {
  message: string;
  errors: ValidationErrors;
};

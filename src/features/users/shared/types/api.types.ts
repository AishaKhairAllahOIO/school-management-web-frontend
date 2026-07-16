export type ApiId = string | number;

export type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type PaginationLinks = {
  first: string | null;
  last?: string | null;
  prev?: string | null;
  next: string | null;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PaginatedData<T> = {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
};

import type { ReactNode } from "react";

export type CrudColumn<T> = {
  key: keyof T | string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: T) => ReactNode;
};

export type CrudConfig<T> = {
  title: string;
  searchPlaceholder: string;
  columns: CrudColumn<T>[];
};
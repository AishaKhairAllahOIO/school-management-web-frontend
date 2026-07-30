import type { ReactNode } from "react";

export type DatePickerValue = string | null | undefined;

export type DatePickerProps = {
  value?: DatePickerValue;

  onChange: (value: string) => void;

  name?: string;
  id?: string;

  label?: string;
  placeholder?: string;

  error?: string;
  helperText?: string;

  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;

  min?: string;
  max?: string;

  className?: string;

  icon?: ReactNode;
};
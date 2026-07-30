import {
  format,
  isValid,
  parse,
  parseISO,
  startOfDay,
} from "date-fns";

export const API_DATE_FORMAT = "yyyy-MM-dd";
export const DISPLAY_DATE_FORMAT = "dd MMM yyyy";

export function parseApiDate(
  value?: string | null,
): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsedDate = parseISO(value);

  if (!isValid(parsedDate)) {
    return undefined;
  }

  return startOfDay(parsedDate);
}

export function formatDateForApi(
  date?: Date,
): string {
  if (!date || !isValid(date)) {
    return "";
  }

  return format(date, API_DATE_FORMAT);
}

export function formatDateForDisplay(
  value?: string | null,
): string {
  const date = parseApiDate(value);

  if (!date) {
    return "";
  }

  return format(date, DISPLAY_DATE_FORMAT);
}

export function parseTypedDate(
  value: string,
): Date | undefined {
  const parsedDate = parse(
    value,
    DISPLAY_DATE_FORMAT,
    new Date(),
  );

  if (!isValid(parsedDate)) {
    return undefined;
  }

  return parsedDate;
}
export type SelectOption = {
  value: string;
  label: string;
};

export type NamedRecord = {
  id: string | number;

  name?: string;
  title?: string;
  label?: string;

  academicYearName?: string;
  yearName?: string;

  academicTermName?: string;
  termName?: string;
};

export function getRecordName(
  item: NamedRecord,
): string {
  return (
    item.name ??
    item.title ??
    item.label ??
    item.academicYearName ??
    item.yearName ??
    item.academicTermName ??
    item.termName ??
    "Unnamed"
  );
}

export function createOptions(
  items: NamedRecord[],
): SelectOption[] {
  return items.map((item) => ({
    value: String(item.id),
    label: getRecordName(item),
  }));
}

export function getOptionLabel(
  options: SelectOption[],
  value: string,
): string {
  return (
    options.find(
      (option) =>
        option.value === value,
    )?.label ?? "—"
  );
}

export function createPreferredPeriodOptions(
  periodsCount = 10,
): SelectOption[] {
  return Array.from(
    {
      length: periodsCount,
    },
    (_, index) => ({
      value: String(index + 1),
      label: `Period ${index + 1}`,
    }),
  );
}
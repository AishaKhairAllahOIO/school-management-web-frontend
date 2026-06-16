type CsvValue = string | number | boolean | null | undefined;

type CsvColumn<TData> = {
  key: keyof TData;
  label: string;
};

function escapeCsvValue(value: CsvValue) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let currentValue = "";
  let isInsideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      currentValue += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      isInsideQuotes = !isInsideQuotes;
      continue;
    }

    if (character === "," && !isInsideQuotes) {
      values.push(currentValue);
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue);

  return values;
}

export function exportDataToCsv<TData extends Record<string, unknown>>(
  data: TData[],
  columns: CsvColumn<TData>[],
  fileName: string
) {
  const headerRow = columns.map((column) => escapeCsvValue(column.label));

  const dataRows = data.map((item) =>
    columns.map((column) => escapeCsvValue(item[column.key] as CsvValue))
  );

  const csvContent = [headerRow, ...dataRows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

export async function parseCsvFile(file: File) {
  const text = await file.text();
  const normalizedText = text.trim();

  if (!normalizedText) return [];

  const [headerLine, ...lines] = normalizedText.split(/\r?\n/);

  const headers = parseCsvLine(headerLine).map((header) => header.trim());

  return lines.map((line) => {
    const values = parseCsvLine(line);

    return Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""])
    );
  });
}
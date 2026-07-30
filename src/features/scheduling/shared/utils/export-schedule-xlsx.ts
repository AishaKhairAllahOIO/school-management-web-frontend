import * as XLSX from "xlsx";

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function exportScheduleWorkbook({
  fileName,
  sheetName,
  rows,
}: {
  fileName: string;
  sheetName: string;
  rows: Array<Record<string, string | number | boolean | null | undefined>>;
}) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    sheetName.slice(0, 31),
  );

  XLSX.writeFile(
    workbook,
    `${sanitizeFileName(fileName)}-${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
}

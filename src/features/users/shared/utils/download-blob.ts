export function downloadBlob(
  blob: Blob,
  fileName: string,
): void {
  const objectUrl =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href =
    objectUrl;

  anchor.download =
    fileName;

  anchor.style.display =
    "none";

  document.body.appendChild(
    anchor,
  );

  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(
    objectUrl,
  );
}

export function getFileNameFromContentDisposition(
  contentDisposition?: string,
  fallbackFileName = "download",
): string {
  if (!contentDisposition) {
    return fallbackFileName;
  }

  const utf8Match =
    contentDisposition.match(
      /filename\*=UTF-8''([^;]+)/i,
    );

  if (utf8Match?.[1]) {
    return decodeURIComponent(
      utf8Match[1],
    );
  }

  const regularMatch =
    contentDisposition.match(
      /filename="?([^";]+)"?/i,
    );

  return (
    regularMatch?.[1] ??
    fallbackFileName
  );
}
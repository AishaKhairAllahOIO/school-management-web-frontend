export function formatNoticeTime(
  value: string,
  locale?: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffInSeconds = Math.round(
    (date.getTime() - Date.now()) / 1000,
  );

  const formatter =
    new Intl.RelativeTimeFormat(
      locale,
      {
        numeric: "auto",
      },
    );

  const ranges = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ] as const;

  let valueInUnit = diffInSeconds;

  for (const [amount, unit] of ranges) {
    if (Math.abs(valueInUnit) < amount) {
      return formatter.format(
        Math.round(valueInUnit),
        unit,
      );
    }

    valueInUnit /= amount;
  }

  return "";
}

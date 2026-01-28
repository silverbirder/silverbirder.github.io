export const toDate = (value: string) => {
  return new Date(value);
};

const toUtcDate = (value: string) => {
  const [yearText, monthText, dayText] = value.split("-");
  if (!yearText || !monthText || !dayText) {
    return new Date(value);
  }

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
    return new Date(Date.UTC(year, month - 1, day));
  }

  return new Date(value);
};

export const formatPublishedDate = (value: string, locale = "ja-JP") => {
  const date = toUtcDate(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
};

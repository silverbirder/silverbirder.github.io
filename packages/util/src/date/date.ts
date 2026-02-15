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

export const formatPublishedDate = (value: string) => {
  const date = toUtcDate(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}年${month}月${day}日`;
};

export const formatNotebookDate = (value: string) => {
  const date = toUtcDate(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}`;
};

export const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export const parsePublishedAtDate = (value: string) => {
  const normalized = value.trim();
  if (!normalized) {
    return new Date();
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const parsed = new Date(`${normalized}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

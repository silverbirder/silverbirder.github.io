export const toDate = (value: string) => {
  return new Date(value);
};

const getTokyoDateParts = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat("ja-JP", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tokyo",
    year: "numeric",
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) => {
    return parts.find((part) => part.type === type)?.value ?? "";
  };

  return {
    day: getPart("day"),
    month: getPart("month"),
    year: getPart("year"),
  };
};

export const formatPublishedDate = (value: string) => {
  const parts = getTokyoDateParts(value);
  if (!parts) {
    return value;
  }

  return `${parts.year}年${parts.month}月${parts.day}日`;
};

export const formatNotebookDate = (value: string) => {
  const parts = getTokyoDateParts(value);
  if (!parts) {
    return value;
  }

  return `${parts.year}. ${parts.month}. ${parts.day}`;
};

export const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const getTokyoDateTimeParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tokyo",
    year: "numeric",
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) => {
    return parts.find((part) => part.type === type)?.value ?? "";
  };

  return {
    day: getPart("day"),
    hour: getPart("hour"),
    minute: getPart("minute"),
    month: getPart("month"),
    year: getPart("year"),
  };
};

export const formatTokyoDateTimeLocalInputValue = (date: Date) => {
  const parts = getTokyoDateTimeParts(date);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};

export const normalizePublishedAtInputValue = (value: string, date: Date) => {
  const trimmed = value.trim();
  const dateOnlyMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (dateOnlyMatch?.[1]) {
    return `${dateOnlyMatch[1]}T09:00`;
  }

  const localDateTimeMatch = trimmed.match(
    /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::\d{2})?$/,
  );
  if (localDateTimeMatch) {
    return `${localDateTimeMatch[1]}T${localDateTimeMatch[2]}:${localDateTimeMatch[3]}`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return formatTokyoDateTimeLocalInputValue(parsed);
  }

  return formatTokyoDateTimeLocalInputValue(date);
};

export const formatJapaneseDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const parts = new Intl.DateTimeFormat("ja-JP", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Tokyo",
    year: "numeric",
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) => {
    return parts.find((part) => part.type === type)?.value ?? "";
  };

  return `${getPart("year")}年${getPart("month")}月${getPart("day")}日 ${getPart("hour")}時${getPart("minute")}分${getPart("second")}秒`;
};

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

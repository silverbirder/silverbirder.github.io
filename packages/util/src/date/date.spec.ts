import { describe, expect, it } from "vitest";

import {
  formatDate,
  formatJapaneseDateTime,
  formatNotebookDate,
  formatPublishedDate,
  formatTokyoDateTimeLocalInputValue,
  normalizePublishedAtInputValue,
  parsePublishedAtDate,
} from "./date";

describe("formatPublishedDate", () => {
  it("formats YYYY-MM-DD to Japanese year-month-day date", () => {
    const formatted = formatPublishedDate("2025-01-02");

    expect(formatted).toBe("2025年01月02日");
  });

  it("returns the input when it cannot parse the date", () => {
    const formatted = formatPublishedDate("not-a-date");

    expect(formatted).toBe("not-a-date");
  });
});

describe("formatNotebookDate", () => {
  it("formats YYYY-MM-DD to notebook date style", () => {
    const formatted = formatNotebookDate("2025-01-02");

    expect(formatted).toBe("2025. 01. 02");
  });

  it("returns the input when it cannot parse the date", () => {
    const formatted = formatNotebookDate("not-a-date");

    expect(formatted).toBe("not-a-date");
  });
});

describe("parsePublishedAtDate", () => {
  it("parses yyyy-mm-dd as a date", () => {
    // Arrange
    const value = "2026-02-01";

    // Act
    const result = parsePublishedAtDate(value);

    // Assert
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(1);
  });

  it("returns a valid date for full datetime strings", () => {
    // Arrange
    const value = "2026-02-01T09:10:11Z";

    // Act
    const result = parsePublishedAtDate(value);

    // Assert
    expect(result.toISOString()).toBe("2026-02-01T09:10:11.000Z");
  });

  it("falls back to now when the value is invalid", () => {
    // Arrange
    const value = "not-a-date";
    const before = Date.now();

    // Act
    const result = parsePublishedAtDate(value);

    // Assert
    expect(result.getTime()).toBeGreaterThanOrEqual(before);
  });
});

describe("formatDate", () => {
  it("formats date as yyyy-mm-dd using UTC", () => {
    // Arrange
    const date = new Date("2026-02-01T12:34:56Z");

    // Act
    const result = formatDate(date);

    // Assert
    expect(result).toBe("2026-02-01");
  });
});

describe("formatTokyoDateTimeLocalInputValue", () => {
  it("formats a date as datetime-local value in JST", () => {
    // Arrange
    const date = new Date("2026-02-01T13:10:00Z");

    // Act
    const result = formatTokyoDateTimeLocalInputValue(date);

    // Assert
    expect(result).toBe("2026-02-01T22:10");
  });
});

describe("normalizePublishedAtInputValue", () => {
  it("adds default 09:00 time to legacy date-only values", () => {
    // Arrange
    const value = "2026-02-01";
    const fallbackDate = new Date("2026-02-02T13:10:00Z");

    // Act
    const result = normalizePublishedAtInputValue(value, fallbackDate);

    // Assert
    expect(result).toBe("2026-02-01T09:00");
  });

  it("keeps hour and minute from local datetime values", () => {
    // Arrange
    const value = "2026-02-01T22:10";
    const fallbackDate = new Date("2026-02-02T13:10:00Z");

    // Act
    const result = normalizePublishedAtInputValue(value, fallbackDate);

    // Assert
    expect(result).toBe("2026-02-01T22:10");
  });

  it("formats offset datetime values as JST datetime-local values", () => {
    // Arrange
    const value = "2026-02-01T13:10:00Z";
    const fallbackDate = new Date("2026-02-02T13:10:00Z");

    // Act
    const result = normalizePublishedAtInputValue(value, fallbackDate);

    // Assert
    expect(result).toBe("2026-02-01T22:10");
  });
});

describe("formatJapaneseDateTime", () => {
  it("formats ISO datetime to Japanese year-month-day time in JST", () => {
    const formatted = formatJapaneseDateTime("2026-02-01T12:34:56Z");

    expect(formatted).toBe("2026年02月01日 21時34分56秒");
  });

  it("returns the input when it cannot parse the date", () => {
    const formatted = formatJapaneseDateTime("not-a-date");

    expect(formatted).toBe("not-a-date");
  });
});

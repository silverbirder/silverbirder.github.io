import { describe, expect, it } from "vitest";

import { formatPublishedDate } from "./date";

describe("formatPublishedDate", () => {
  it("formats YYYY-MM-DD to Japanese numeric date", () => {
    const formatted = formatPublishedDate("2025-01-02");

    expect(formatted).toBe("2025/01/02");
  });

  it("returns the input when it cannot parse the date", () => {
    const formatted = formatPublishedDate("not-a-date");

    expect(formatted).toBe("not-a-date");
  });
});

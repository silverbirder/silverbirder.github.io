import { describe, expect, it } from "vitest";

import { isAllowedEmail, parseAllowedEmails } from "./allowed-users";

describe("parseAllowedEmails", () => {
  it("parses comma-separated emails, trims, lowercases, and removes blanks", () => {
    const raw = "Alice@Example.com,BOB@EXAMPLE.COM,carol@example.com";
    expect(parseAllowedEmails(raw)).toEqual([
      "alice@example.com",
      "bob@example.com",
      "carol@example.com",
    ]);
  });

  it("returns an empty array when input is missing", () => {
    expect(parseAllowedEmails()).toEqual([]);
  });
});

describe("isAllowedEmail", () => {
  it("checks case-insensitively and handles empty input", () => {
    const allowed = ["alice@example.com"];
    expect(isAllowedEmail("ALICE@EXAMPLE.COM", allowed)).toBe(true);
    expect(isAllowedEmail(null, allowed)).toBe(false);
    expect(isAllowedEmail(undefined, allowed)).toBe(false);
  });
});

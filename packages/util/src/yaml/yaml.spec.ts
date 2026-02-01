import { describe, expect, it } from "vitest";

import { escapeYamlSingleQuotedString, formatYamlStringList } from "./yaml";

describe("escapeYamlSingleQuotedString", () => {
  it("escapes single quotes for YAML single-quoted strings", () => {
    // Arrange
    const value = "O'Reilly";

    // Act
    const result = escapeYamlSingleQuotedString(value);

    // Assert
    expect(result).toBe("O''Reilly");
  });

  it("returns the same value when there is no single quote", () => {
    // Arrange
    const value = "plain";

    // Act
    const result = escapeYamlSingleQuotedString(value);

    // Assert
    expect(result).toBe("plain");
  });
});

describe("formatYamlStringList", () => {
  it("formats unique trimmed values as a YAML array", () => {
    // Arrange
    const values = [" alpha ", "beta", "ALPHA", "beta", "  "];

    // Act
    const result = formatYamlStringList(values);

    // Assert
    expect(result).toBe("['alpha', 'beta', 'ALPHA']");
  });

  it("escapes single quotes inside values", () => {
    // Arrange
    const values = ["O'Reilly", "John's"];

    // Act
    const result = formatYamlStringList(values);

    // Assert
    expect(result).toBe("['O''Reilly', 'John''s']");
  });

  it("returns empty list when there are no usable values", () => {
    // Arrange
    const values = [" ", "\n", "\t"];

    // Act
    const result = formatYamlStringList(values);

    // Assert
    expect(result).toBe("[]");
  });
});

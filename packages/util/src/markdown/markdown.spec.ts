import { describe, expect, it } from "vitest";

import { hasFrontmatter } from "./markdown";

describe("hasFrontmatter", () => {
  it("returns true when frontmatter exists at the start", () => {
    // Arrange
    const source = ["---", "title: Example", "---", "", "Body"].join("\n");

    // Act
    const result = hasFrontmatter(source);

    // Assert
    expect(result).toBe(true);
  });

  it("returns true when frontmatter exists after whitespace", () => {
    // Arrange
    const source = ["\n", "\n", "---", "title: Example", "---", "Body"].join(
      "\n",
    );

    // Act
    const result = hasFrontmatter(source);

    // Assert
    expect(result).toBe(true);
  });

  it("returns false when there is no closing delimiter", () => {
    // Arrange
    const source = ["---", "title: Example", "Body"].join("\n");

    // Act
    const result = hasFrontmatter(source);

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when the content does not start with delimiter", () => {
    // Arrange
    const source = "Body\n---\ntitle: Example\n---";

    // Act
    const result = hasFrontmatter(source);

    // Assert
    expect(result).toBe(false);
  });
});

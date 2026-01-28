import { afterEach, describe, expect, it } from "vitest";

import { iconSizes } from "./icon";
import manifest from "./manifest";

const originalBasePath = process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH;

const restoreEnv = () => {
  if (originalBasePath === undefined) {
    delete process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH = originalBasePath;
  }
};

afterEach(() => {
  restoreEnv();
});

describe("manifest", () => {
  it("scopes the manifest paths to the base path", () => {
    process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH = "/docs";

    const result = manifest();

    expect(result.start_url).toBe("/docs/");
    expect(result.scope).toBe("/docs/");
    expect(result.icons).toEqual(
      iconSizes.map((size) => ({
        sizes: `${size}x${size}`,
        src: `/docs/icon/${size}`,
        type: "image/png",
      })),
    );
  });
});

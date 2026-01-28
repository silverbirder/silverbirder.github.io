import { afterEach, describe, expect, it, vi } from "vitest";

const { ImageResponse, readFile } = vi.hoisted(() => ({
  ImageResponse: vi.fn().mockImplementation(function (...args) {
    return { args };
  }),
  readFile: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  readFile,
}));

vi.mock("next/og", () => ({
  ImageResponse,
}));

import AppleIcon, { contentType, size } from "./apple-icon";

afterEach(() => {
  vi.clearAllMocks();
});

describe("apple-icon", () => {
  it("builds a png apple icon response", async () => {
    readFile.mockResolvedValue(Buffer.from([1, 2, 3]));

    const result = await AppleIcon();

    expect(contentType).toBe("image/png");
    expect(size).toEqual({ height: 180, width: 180 });
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(String(readFile.mock.calls[0]?.[0])).toContain(
      "/public/assets/logo.png",
    );
    expect(ImageResponse).toHaveBeenCalledWith(expect.anything(), size);
    expect(result).toEqual({ args: [expect.anything(), size] });
  });
});

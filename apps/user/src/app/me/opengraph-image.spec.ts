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

import {
  buildOpenGraphImage,
  contentType,
  GET,
  size,
} from "./opengraph-image.png/route";

afterEach(() => {
  vi.clearAllMocks();
});

describe("me/opengraph-image.png", () => {
  it("builds a png image response", async () => {
    readFile.mockResolvedValue(Buffer.from([1, 2, 3]));

    const result = await buildOpenGraphImage();

    expect(contentType).toBe("image/png");
    expect(size).toEqual({ height: 630, width: 1200 });
    expect(readFile).toHaveBeenCalledTimes(3);
    const readFileTargets = readFile.mock.calls.map((call) => String(call[0]));
    expect(readFileTargets).toEqual(
      expect.arrayContaining([
        expect.stringContaining("/public/assets/logo.png"),
        expect.stringContaining("/public/fonts/KleeOne-Regular.ttf"),
        expect.stringContaining("/public/fonts/KleeOne-SemiBold.ttf"),
      ]),
    );
    expect(ImageResponse).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...size,
        fonts: [
          expect.objectContaining({ name: "Klee One", weight: 400 }),
          expect.objectContaining({ name: "Klee One", weight: 600 }),
        ],
      }),
    );
    expect(result).toEqual({
      args: [
        expect.anything(),
        expect.objectContaining({
          ...size,
          fonts: [
            expect.objectContaining({ name: "Klee One", weight: 400 }),
            expect.objectContaining({ name: "Klee One", weight: 600 }),
          ],
        }),
      ],
    });
  });

  it("serves image response on GET", async () => {
    readFile.mockResolvedValue(Buffer.from([1, 2, 3]));

    const result = await GET();

    expect(ImageResponse).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      args: [
        expect.anything(),
        expect.objectContaining({
          ...size,
          fonts: [
            expect.objectContaining({ name: "Klee One", weight: 400 }),
            expect.objectContaining({ name: "Klee One", weight: 600 }),
          ],
        }),
      ],
    });
  });
});

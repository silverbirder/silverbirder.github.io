import { afterEach, describe, expect, it, vi } from "vitest";

const { ImageResponse, readFile } = vi.hoisted(() => ({
  ImageResponse: vi.fn().mockImplementation(function (...args) {
    return { args };
  }),
  readFile: vi.fn(),
}));

const { getPostFrontmatter, getPostSlugs } = vi.hoisted(() => ({
  getPostFrontmatter: vi.fn(),
  getPostSlugs: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  readFile,
}));

vi.mock("next/og", () => ({
  ImageResponse,
}));

vi.mock("@/libs", () => ({
  getPostFrontmatter,
  getPostSlugs,
}));

import {
  buildOpenGraphImage,
  contentType,
  generateStaticParams,
  GET,
  size,
} from "./opengraph-image/route";

afterEach(() => {
  vi.clearAllMocks();
});

describe("blog/contents/[slug]/opengraph-image", () => {
  it("builds a png image response", async () => {
    readFile.mockResolvedValue(Buffer.from([1, 2, 3]));
    getPostFrontmatter.mockResolvedValue({ title: "テストタイトル" });

    const result = await buildOpenGraphImage("my-post");

    expect(contentType).toBe("image/png");
    expect(size).toEqual({ height: 630, width: 1200 });
    expect(readFile).toHaveBeenCalledTimes(3);
    expect(getPostFrontmatter).toHaveBeenCalledWith("my-post");
    const readFileTargets = readFile.mock.calls.map((call) => String(call[0]));
    expect(readFileTargets).toEqual(
      expect.arrayContaining([
        expect.stringContaining("/public/assets/logo.png"),
        expect.stringContaining("/public/fonts/NotoSansJP-Regular.ttf"),
        expect.stringContaining("/public/fonts/NotoSansJP-Bold.ttf"),
      ]),
    );
    expect(ImageResponse).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...size,
        fonts: [
          expect.objectContaining({ name: "Noto Sans JP", weight: 400 }),
          expect.objectContaining({ name: "Noto Sans JP", weight: 700 }),
        ],
      }),
    );
    expect(result).toEqual({
      args: [
        expect.anything(),
        expect.objectContaining({
          ...size,
          fonts: [
            expect.objectContaining({ name: "Noto Sans JP", weight: 400 }),
            expect.objectContaining({ name: "Noto Sans JP", weight: 700 }),
          ],
        }),
      ],
    });
  });

  it("returns 404 response when title is missing", async () => {
    readFile.mockResolvedValue(Buffer.from([1, 2, 3]));
    getPostFrontmatter.mockResolvedValue({ title: "" });

    const result = await buildOpenGraphImage("missing");

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(404);
  });

  it("returns static params from slugs", async () => {
    getPostSlugs.mockResolvedValue([{ slug: "one" }, { slug: "two" }]);

    await expect(generateStaticParams()).resolves.toEqual([
      { slug: "one" },
      { slug: "two" },
    ]);
  });

  it("serves image response on GET", async () => {
    readFile.mockResolvedValue(Buffer.from([1, 2, 3]));
    getPostFrontmatter.mockResolvedValue({ title: "テストタイトル" });

    const result = await GET(new Request("https://example.com"), {
      params: Promise.resolve({ slug: "my-post" }),
    });

    expect(ImageResponse).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      args: [
        expect.anything(),
        expect.objectContaining({
          ...size,
          fonts: [
            expect.objectContaining({ name: "Noto Sans JP", weight: 400 }),
            expect.objectContaining({ name: "Noto Sans JP", weight: 700 }),
          ],
        }),
      ],
    });
  });
});

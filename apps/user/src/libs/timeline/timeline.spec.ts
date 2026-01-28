import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs/promises", () => ({
  readdir: vi.fn(),
  readFile: vi.fn(),
}));

import { readdir, readFile } from "node:fs/promises";

import { getTimelineEntry, getTimelineSlugs } from "./timeline";

const createDirent = (name: string, isFile: boolean) =>
  ({ isFile: () => isFile, name }) as unknown as Awaited<
    ReturnType<typeof readdir>
  >[number];

describe("getTimelineSlugs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns timeline slugs sorted by publishedAt desc", async () => {
    const mockedReaddir = vi.mocked(readdir);
    const mockedReadFile = vi.mocked(readFile);

    mockedReaddir.mockResolvedValue([
      createDirent("20260101.md", true),
      createDirent("20260103.md", true),
      createDirent("note.txt", true),
      createDirent("assets", false),
    ]);
    mockedReadFile
      .mockResolvedValueOnce('---\npublishedAt: "2026-01-01"\n---\nA')
      .mockResolvedValueOnce('---\npublishedAt: "2026-01-03"\n---\nB');

    const slugs = await getTimelineSlugs();

    expect(slugs).toEqual([
      { publishedAt: "2026-01-03", slug: "20260103" },
      { publishedAt: "2026-01-01", slug: "20260101" },
    ]);
  });

  it("uses publicAt when publishedAt is missing", async () => {
    const mockedReaddir = vi.mocked(readdir);
    const mockedReadFile = vi.mocked(readFile);

    mockedReaddir.mockResolvedValue([createDirent("20260102.md", true)]);
    mockedReadFile.mockResolvedValueOnce("---\npublicAt: 2026-01-02\n---\nA");

    const slugs = await getTimelineSlugs();

    expect(slugs).toEqual([{ publishedAt: "2026-01-02", slug: "20260102" }]);
  });
});

describe("getTimelineEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("extracts publishedAt, type, and body from markdown", async () => {
    const mockedReadFile = vi.mocked(readFile);

    mockedReadFile.mockResolvedValueOnce(
      '---\npublishedAt: "2026-01-04"\ntype: tweet\n---\n\n本文です。\n',
    );

    const entry = await getTimelineEntry("20260104");

    expect(entry).toEqual({
      description: "本文です。",
      publishedAt: "2026-01-04",
      slug: "20260104",
      type: "tweet",
    });
  });
});

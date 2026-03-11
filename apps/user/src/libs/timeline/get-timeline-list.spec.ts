import { describe, expect, it, vi } from "vitest";

vi.mock("../link-card", () => ({
  createUserLinkCardResolver: vi.fn().mockResolvedValue(vi.fn()),
}));

vi.mock("./timeline", () => ({
  getTimelineEntry: vi.fn(),
  getTimelineSlugs: vi.fn(),
}));

import { createUserLinkCardResolver } from "../link-card";
import { getTimelineList } from "./get-timeline-list";
import { getTimelineEntry, getTimelineSlugs } from "./timeline";

const { serialize } = vi.hoisted(() => ({
  serialize: vi.fn().mockResolvedValue({ compiledSource: "<p>ok</p>" }),
}));

vi.mock("next-mdx-remote-client/serialize", () => ({
  serialize,
}));

describe("getTimelineList", () => {
  it("returns timeline entries sorted by date desc", async () => {
    const mockedGetTimelineSlugs = vi.mocked(getTimelineSlugs);
    const mockedGetTimelineEntry = vi.mocked(getTimelineEntry);

    mockedGetTimelineSlugs.mockResolvedValue([
      { publishedAt: "2026-01-01", slug: "first" },
      { publishedAt: "2026-01-02", slug: "second" },
    ]);
    mockedGetTimelineEntry
      .mockResolvedValueOnce({
        description: "1つ目の出来事。",
        publishedAt: "2026-01-01",
        slug: "first",
        type: "bookmark",
      })
      .mockResolvedValueOnce({
        description: "2つ目の出来事。",
        publishedAt: "2026-01-02",
        slug: "second",
        type: "tweet",
      });

    const items = await getTimelineList();

    expect(items).toEqual([
      {
        compiledSource: "<p>ok</p>",
        date: "2026-01-02",
        key: "timeline-second",
        type: "tweet",
      },
      {
        compiledSource: "<p>ok</p>",
        date: "2026-01-01",
        key: "timeline-first",
        type: "bookmark",
      },
    ]);
    expect(mockedGetTimelineSlugs).toHaveBeenCalledTimes(1);
    expect(mockedGetTimelineEntry).toHaveBeenNthCalledWith(1, "first");
    expect(mockedGetTimelineEntry).toHaveBeenNthCalledWith(2, "second");
    expect(createUserLinkCardResolver).toHaveBeenCalledTimes(1);
    expect(serialize).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        options: expect.objectContaining({
          mdxOptions: expect.objectContaining({
            remarkPlugins: expect.any(Array),
          }),
        }),
        source: "1つ目の出来事。",
      }),
    );
  });
});

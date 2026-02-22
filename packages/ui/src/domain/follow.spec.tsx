import { describe, expect, it } from "vitest";

import { createFollowSection } from "./follow";

describe("createFollowSection", () => {
  it("builds follow items with labels and links in order", () => {
    const follow = createFollowSection({
      labels: {
        bluesky: "Blueskyをフォロー",
        github: "GitHubをフォロー",
        heading: "フォローする",
        threads: "Threadsをフォロー",
        x: "Xをフォロー",
      },
      links: {
        bluesky: "https://example.com/bluesky",
        github: "https://example.com/github",
        rss: "https://example.com/rss",
        threads: "https://example.com/threads",
        x: "https://example.com/x",
      },
    });

    expect(follow.heading).toBe("フォローする");
    expect(follow.items).toHaveLength(4);
    expect(follow.items[0]).toMatchObject({
      href: "https://example.com/x",
      label: "Xをフォロー",
    });
    expect(follow.items[1]).toMatchObject({
      href: "https://example.com/bluesky",
      label: "Blueskyをフォロー",
    });
    expect(follow.items[2]).toMatchObject({
      href: "https://example.com/github",
      label: "GitHubをフォロー",
    });
    expect(follow.items[3]).toMatchObject({
      href: "https://example.com/threads",
      label: "Threadsをフォロー",
    });
  });
});

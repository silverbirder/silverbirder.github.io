import { describe, expect, it } from "vitest";

import { createFollowSection } from "./follow";

describe("createFollowSection", () => {
  it("builds follow items with labels and links in order", () => {
    const follow = createFollowSection({
      labels: {
        bluesky: "Blueskyをフォロー",
        github: "GitHubをフォロー",
        heading: "フォローする",
        x: "Xをフォロー",
      },
      links: {
        bluesky: "https://example.com/bluesky",
        github: "https://example.com/github",
        rss: "https://example.com/rss",
        x: "https://example.com/x",
      },
      profile: {
        avatarSrc: "/assets/logo.png",
        description: "Webソフトウェアエンジニア",
        name: "silverbirder",
      },
    });

    expect(follow.heading).toBe("フォローする");
    expect(follow.items).toHaveLength(3);
    expect(follow.profile).toMatchObject({
      avatarSrc: "/assets/logo.png",
      description: "Webソフトウェアエンジニア",
      name: "silverbirder",
    });
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
  });
});

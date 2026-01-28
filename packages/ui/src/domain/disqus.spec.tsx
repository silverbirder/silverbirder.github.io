import { describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";
import { Disqus } from "./disqus";

vi.mock("disqus-react", () => ({
  DiscussionEmbed: () => <div data-testid="disqus-embed" />,
}));

describe("Disqus", () => {
  it("renders embed", () => {
    renderWithProvider(
      <Disqus
        shortname="https-silverbirder-github-io"
        url="https://example.com/blog/contents/notebook-prose/"
      />,
    );

    expect(
      document.querySelector('[data-testid="disqus-embed"]'),
    ).not.toBeNull();
  });
});

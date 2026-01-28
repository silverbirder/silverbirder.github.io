import { describe, expect, it, vi } from "vitest";

vi.mock("react-tweet", () => {
  return {
    EmbeddedTweet: ({ tweet }: { tweet: { id: string } }) => (
      <div
        data-embed="tweet"
        data-testid="embedded-tweet"
        data-tweet-id={tweet.id}
      />
    ),
    TweetNotFound: ({ error }: { error?: unknown }) => (
      <div
        data-testid="tweet-not-found"
        data-with-error={String(Boolean(error))}
      />
    ),
    TweetSkeleton: () => <div data-testid="tweet-skeleton" />,
    useTweet: (id: string) => {
      if (id === "loading") {
        return { data: null, error: null, isLoading: true };
      }
      if (id === "error") {
        return {
          data: null,
          error: new Error("request failed"),
          isLoading: false,
        };
      }
      if (id === "nodata") {
        return { data: null, error: null, isLoading: false };
      }
      return { data: { id }, error: null, isLoading: false };
    },
  };
});

import { renderWithProvider } from "../test-util";

const load = async () => {
  vi.resetModules();
  const [{ composeStories }, stories, tweetEmbedModule] = await Promise.all([
    import("@storybook/nextjs-vite"),
    import("./tweet-embed.stories"),
    import("./tweet-embed"),
  ]);

  return {
    Stories: composeStories(stories),
    TweetEmbed: tweetEmbedModule.TweetEmbed,
  };
};

describe("TweetEmbed", () => {
  it("should render stories", async () => {
    const { Stories } = await load();

    for (const [name, Story] of Object.entries(Stories)) {
      const originalInnerHtml = document.body.innerHTML;

      await Story.run();

      await expect(document.body).toMatchScreenshot();

      document.body.innerHTML = originalInnerHtml;

      expect(name).toBeTruthy();
    }
  });

  it("renders fallback while loading", async () => {
    const { TweetEmbed } = await load();
    const { container } = await renderWithProvider(
      <TweetEmbed fallback={<div data-testid="fallback" />} id="loading" />,
    );

    expect(container.querySelector('[data-testid="fallback"]')).not.toBeNull();
  });

  it("renders TweetNotFound when error occurs", async () => {
    const { TweetEmbed } = await load();
    const { container } = await renderWithProvider(<TweetEmbed id="error" />);

    const notFound = container.querySelector('[data-testid="tweet-not-found"]');
    expect(notFound).not.toBeNull();
    expect(notFound?.getAttribute("data-with-error")).toBe("true");
  });

  it("renders EmbeddedTweet when data exists", async () => {
    const { TweetEmbed } = await load();
    const { container } = await renderWithProvider(<TweetEmbed id="123" />);

    const embedded = container.querySelector('[data-testid="embedded-tweet"]');
    expect(embedded).not.toBeNull();
    expect(embedded?.getAttribute("data-tweet-id")).toBe("123");

    const outer = container.querySelector('[data-embed="tweet"]');
    expect(outer?.getAttribute("data-tweet-id")).toBe("123");
  });
});

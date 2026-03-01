import { describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";
import { PostSearchPanel } from "./post-search-panel";

class MockWorker {
  static instances: MockWorker[] = [];

  public postedMessages: unknown[] = [];

  private listeners = new Set<(event: MessageEvent<unknown>) => void>();

  constructor(url: string | URL) {
    void url;
    MockWorker.instances.push(this);
  }

  addEventListener(
    type: string,
    listener: (event: MessageEvent<unknown>) => void,
  ) {
    if (type === "message") {
      this.listeners.add(listener);
    }
  }

  postMessage(message: unknown) {
    this.postedMessages.push(message);

    if (
      typeof message === "object" &&
      message !== null &&
      "type" in message &&
      message.type === "load"
    ) {
      this.emit({ payload: { count: 0 }, type: "ready" });
    }
  }

  removeEventListener(
    type: string,
    listener: (event: MessageEvent<unknown>) => void,
  ) {
    if (type === "message") {
      this.listeners.delete(listener);
    }
  }

  terminate() {
    return;
  }

  private emit(data: unknown) {
    for (const listener of this.listeners) {
      listener({ data } as MessageEvent<unknown>);
    }
  }
}

describe("PostSearchPanel", () => {
  it("renders initial query", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ version: "v1" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );

    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker);

    try {
      await renderWithProvider(
        <PostSearchPanel
          initialQuery="TypeScript"
          onResultsChange={() => undefined}
        />,
      );

      const input = document.querySelector<HTMLInputElement>("input");
      expect(input?.value).toBe("TypeScript");
      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });
    } finally {
      vi.unstubAllGlobals();
      MockWorker.instances = [];
      window.localStorage.removeItem("blog-search-index");
      window.localStorage.removeItem("blog-search-index-version");
    }
  });

  it("does not download search index on mount without interaction", async () => {
    window.localStorage.removeItem("blog-search-index");
    window.localStorage.removeItem("blog-search-index-version");

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("blog-search-index.version.json")) {
        return new Response(JSON.stringify({ version: "v1" }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }

      return new Response("[]", {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    });

    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker);

    try {
      await renderWithProvider(
        <PostSearchPanel initialQuery="" onResultsChange={() => undefined} />,
      );

      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
      MockWorker.instances = [];
      window.localStorage.removeItem("blog-search-index");
      window.localStorage.removeItem("blog-search-index-version");
    }
  });

  it("downloads search index on search button click", async () => {
    window.localStorage.removeItem("blog-search-index");
    window.localStorage.removeItem("blog-search-index-version");

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("blog-search-index.version.json")) {
        return new Response(JSON.stringify({ version: "v1" }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }

      return new Response("[]", {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    });

    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker);

    try {
      await renderWithProvider(
        <PostSearchPanel initialQuery="" onResultsChange={() => undefined} />,
      );

      const button = document.querySelector<HTMLButtonElement>("button");
      button?.click();

      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });

      const calledUrls = fetchMock.mock.calls.map(([input]) =>
        typeof input === "string" ? input : input.toString(),
      );

      expect(
        calledUrls.some((url) =>
          url.includes("blog-search-index.version.json"),
        ),
      ).toBe(true);
    } finally {
      vi.unstubAllGlobals();
      MockWorker.instances = [];
      window.localStorage.removeItem("blog-search-index");
      window.localStorage.removeItem("blog-search-index-version");
    }
  });
});

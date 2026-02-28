import { describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";

describe("NotebookComments", () => {
  it("loads and renders comments from API", async () => {
    vi.stubEnv("NEXT_PUBLIC_LIKES_API_URL", "https://api.example.com");
    vi.resetModules();
    window.localStorage.setItem("comments:anon-id", "anon-1");

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          comments: [
            {
              body: "本文コメント",
              createdAt: "2025-01-03T01:02:03.000Z",
              id: 1,
              mine: true,
            },
          ],
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    try {
      const { NotebookComments } = await import("./notebook-comments");
      await renderWithProvider(<NotebookComments slug="test-post" />);

      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });

      await vi.waitFor(() => {
        expect(document.body.textContent ?? "").toContain("本文コメント");
      });

      expect(document.body.textContent ?? "").toContain("コメント");
      expect(document.querySelector("textarea")).not.toBeNull();
    } finally {
      vi.unstubAllEnvs();
      vi.unstubAllGlobals();
      window.localStorage.removeItem("comments:anon-id");
    }
  });

  it("does not crash when localStorage is unavailable", async () => {
    vi.stubEnv("NEXT_PUBLIC_LIKES_API_URL", "https://api.example.com");
    vi.resetModules();

    const localStorageGetter = vi
      .spyOn(window, "localStorage", "get")
      .mockReturnValue(null as unknown as Storage);
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ comments: [] }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    try {
      const { NotebookComments } = await import("./notebook-comments");
      await renderWithProvider(<NotebookComments slug="test-post" />);

      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });
      expect(document.body.textContent ?? "").toContain("コメント");
    } finally {
      localStorageGetter.mockRestore();
      vi.unstubAllEnvs();
      vi.unstubAllGlobals();
    }
  });
});

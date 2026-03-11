import { afterEach, describe, expect, it, vi } from "vitest";

describe("buildLinkCardPullRequestFiles", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does not include faviconSrc in the manifest when the favicon asset is missing", async () => {
    vi.resetModules();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          [
            "<html>",
            "<head>",
            "<title>Example title</title>",
            '<meta property="og:description" content="Description" />',
            "</head>",
            "<body></body>",
            "</html>",
          ].join(""),
          {
            headers: new Headers({
              "content-type": "text/html; charset=utf-8",
            }),
            status: 200,
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          headers: new Headers(),
          status: 404,
        }),
      );

    vi.stubGlobal("fetch", fetchMock);

    const { buildLinkCardPullRequestFiles } = await import("./link-card");
    const files = await buildLinkCardPullRequestFiles(
      "https://example.com/link-card-missing-favicon",
    );

    const manifestFile = files.find(
      (file) => file.path === "packages/content/link-cards.json",
    );
    const manifest = JSON.parse(manifestFile?.content ?? "{}") as Record<
      string,
      Record<string, unknown>
    >;
    const card = manifest["https://example.com/link-card-missing-favicon"];

    expect(card).toEqual({
      description: "Description",
      siteName: "example.com",
      title: "Example title",
      url: "https://example.com/link-card-missing-favicon",
    });
    expect(card).not.toHaveProperty("faviconSrc");
  });

  it("uses a later working favicon candidate when the first one fails", async () => {
    vi.resetModules();

    const fetchMock = vi.fn().mockImplementation((input: string | URL) => {
      const url = String(input);
      if (url === "https://example.com/fallback") {
        return Promise.resolve(
          new Response(
            [
              "<html>",
              "<head>",
              "<title>Example title</title>",
              '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
              '<link rel="icon" href="/favicon.ico" />',
              "</head>",
              "<body></body>",
              "</html>",
            ].join(""),
            {
              headers: new Headers({
                "content-type": "text/html; charset=utf-8",
              }),
              status: 200,
            },
          ),
        );
      }
      if (url === "https://example.com/favicon.ico") {
        return Promise.resolve(
          new Response("ico", {
            headers: new Headers({ "content-type": "image/x-icon" }),
            status: 200,
          }),
        );
      }
      if (url === "https://example.com/apple-touch-icon.png") {
        return Promise.resolve(new Response(null, { status: 404 }));
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    vi.stubGlobal("fetch", fetchMock);

    const { buildLinkCardPullRequestFiles } = await import("./link-card");
    const files = await buildLinkCardPullRequestFiles(
      "https://example.com/fallback",
    );

    const manifestFile = files.find(
      (file) => file.path === "packages/content/link-cards.json",
    );
    const manifest = JSON.parse(manifestFile?.content ?? "{}") as Record<
      string,
      Record<string, unknown>
    >;

    expect(manifest["https://example.com/fallback"]?.faviconSrc).toBeTypeOf(
      "string",
    );
    expect(files.some((file) => file.path.endsWith(".ico"))).toBe(true);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://example.com/favicon.ico",
      expect.any(Object),
    );
  });

  it("resolves favicon links against the document base href", async () => {
    vi.resetModules();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          [
            "<html>",
            "<head>",
            '<base href="/ec/" />',
            "<title>Example title</title>",
            '<link rel="icon" href="assets/icons/site.svg" />',
            "</head>",
            "<body></body>",
            "</html>",
          ].join(""),
          {
            headers: new Headers({
              "content-type": "text/html; charset=utf-8",
            }),
            status: 200,
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response("svg", {
          headers: new Headers({ "content-type": "image/svg+xml" }),
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response("svg", {
          headers: new Headers({ "content-type": "image/svg+xml" }),
          status: 200,
        }),
      );

    vi.stubGlobal("fetch", fetchMock);

    const { buildLinkCardPullRequestFiles } = await import("./link-card");
    const files = await buildLinkCardPullRequestFiles(
      "https://example.com/product/123",
    );

    const manifestFile = files.find(
      (file) => file.path === "packages/content/link-cards.json",
    );
    const manifest = JSON.parse(manifestFile?.content ?? "{}") as Record<
      string,
      Record<string, unknown>
    >;

    expect(manifest["https://example.com/product/123"]?.faviconSrc).toBeTypeOf(
      "string",
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://example.com/ec/assets/icons/site.svg",
      expect.any(Object),
    );
  });
});

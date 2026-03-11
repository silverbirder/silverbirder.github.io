import { afterEach, describe, expect, it, vi } from "vitest";

describe("createUserLinkCardResolver", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does not return faviconSrc when the favicon request fails", async () => {
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

    const { createUserLinkCardResolver } = await import("./link-card");
    const resolveCard = await createUserLinkCardResolver();

    const card = await resolveCard(
      "https://example.com/link-card-missing-favicon",
    );

    expect(card).toEqual({
      description: "Description",
      siteName: "example.com",
      thumbnailSrc: undefined,
      title: "Example title",
      url: "https://example.com/link-card-missing-favicon",
    });
    expect(card).not.toHaveProperty("faviconSrc");
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://example.com/favicon.ico",
      expect.any(Object),
    );
  });

  it("falls back from a broken apple-touch-icon to a working icon", async () => {
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

    const { createUserLinkCardResolver } = await import("./link-card");
    const resolveCard = await createUserLinkCardResolver();

    const card = await resolveCard("https://example.com/fallback");

    expect(card?.faviconSrc).toBe("https://example.com/favicon.ico");
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
      );

    vi.stubGlobal("fetch", fetchMock);

    const { createUserLinkCardResolver } = await import("./link-card");
    const resolveCard = await createUserLinkCardResolver();

    const card = await resolveCard("https://example.com/product/123");

    expect(card?.faviconSrc).toBe(
      "https://example.com/ec/assets/icons/site.svg",
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://example.com/ec/assets/icons/site.svg",
      expect.any(Object),
    );
  });

  it("reads unquoted href attributes in link tags", async () => {
    vi.resetModules();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          [
            "<html>",
            "<head>",
            "<title>Example title</title>",
            '<link rel="shortcut icon" href=/images/site.png type=image/png>',
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
        new Response("png", {
          headers: new Headers({ "content-type": "image/png" }),
          status: 200,
        }),
      );

    vi.stubGlobal("fetch", fetchMock);

    const { createUserLinkCardResolver } = await import("./link-card");
    const resolveCard = await createUserLinkCardResolver();

    const card = await resolveCard("https://example.com/unquoted");

    expect(card?.faviconSrc).toBe("https://example.com/images/site.png");
  });

  it("prefers svg icons over ico icons when both are present", async () => {
    vi.resetModules();

    const fetchMock = vi.fn().mockImplementation((input: string | URL) => {
      const url = String(input);
      if (url === "https://example.com/prefer-svg") {
        return Promise.resolve(
          new Response(
            [
              "<html>",
              "<head>",
              "<title>Example title</title>",
              '<link rel="icon" href="/favicon.ico" />',
              '<link rel="icon" href="/favicon.svg" />',
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
      if (url === "https://example.com/favicon.svg") {
        return Promise.resolve(
          new Response("<svg></svg>", {
            headers: new Headers({ "content-type": "image/svg+xml" }),
            status: 200,
          }),
        );
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    vi.stubGlobal("fetch", fetchMock);

    const { createUserLinkCardResolver } = await import("./link-card");
    const resolveCard = await createUserLinkCardResolver();

    const card = await resolveCard("https://example.com/prefer-svg");

    expect(card?.faviconSrc).toBe("https://example.com/favicon.svg");
  });
});

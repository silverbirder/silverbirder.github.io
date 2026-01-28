import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createCallerFactory } from "@/server/api/trpc";

vi.mock("@/env", () => ({
  env: { ADMIN_ALLOWED_EMAILS: "allowed@example.com" },
}));

const { serialize } = vi.hoisted(() => ({
  serialize: vi.fn(),
}));

vi.mock("next-mdx-remote-client/serialize", () => ({
  serialize,
}));

const { session } = vi.hoisted(() => ({
  session: {
    session: {
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      id: "session-1",
      token: "session-token",
      updatedAt: new Date(),
      userId: "user-1",
    },
    user: {
      createdAt: new Date(),
      email: "allowed@example.com",
      emailVerified: true,
      id: "user-1",
      name: "Allowed User",
      updatedAt: new Date(),
    },
  },
}));

import { mdxRouter } from "./mdx";

const createCaller = createCallerFactory(mdxRouter);

describe("mdxRouter.preview", () => {
  afterEach(() => {
    serialize.mockClear();
    vi.unstubAllGlobals();
  });

  it("serializes markdown content", async () => {
    serialize.mockResolvedValue({
      compiledSource: "<p>preview</p>",
      frontmatter: {},
      scope: {},
    });

    const caller = createCaller({
      headers: new Headers(),
      session,
    });

    const result = await caller.preview({ source: "# Preview" });

    expect(serialize).toHaveBeenCalledWith({
      options: {
        disableExports: true,
        disableImports: true,
        mdxOptions: expect.objectContaining({
          rehypePlugins: expect.arrayContaining([
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              expect.objectContaining({
                behavior: "wrap",
                properties: { className: ["mdx-heading-anchor"] },
              }),
            ],
            [
              rehypePrettyCode,
              expect.objectContaining({
                keepBackground: false,
                theme: { dark: "github-dark", light: "github-light" },
              }),
            ],
          ]),
          remarkPlugins: expect.any(Array),
        }),
      },
      source: "# Preview",
    });
    expect(result).toEqual({
      compiledSource: "<p>preview</p>",
      frontmatter: {},
      scope: {},
    });
  });
});

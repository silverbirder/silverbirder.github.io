import type { ComponentPropsWithoutRef, ComponentType } from "react";

import { describe, expect, it, vi } from "vitest";

vi.mock("./tweet-embed", () => {
  return {
    TweetEmbed: ({ id }: { id: string }) => (
      <div data-embed="tweet" data-tweet-id={id} />
    ),
  };
});

import { renderWithProvider } from "../test-util";
import { mdxComponents } from "./mdx-components";
import { NotebookImage } from "./notebook-image";

describe("mdxComponents", () => {
  it("does not wrap NotebookImage with a <p>", async () => {
    const P = mdxComponents.p as unknown as ComponentType<
      ComponentPropsWithoutRef<"p">
    >;

    const { container } = await renderWithProvider(
      <P>
        <NotebookImage alt="Notebook sample" src="/test.png" />
      </P>,
    );

    expect(container.querySelector("p")).toBeNull();
    expect(container.querySelector("figure")).not.toBeNull();
  });

  it("does not wrap linked NotebookImage with a <p>", async () => {
    const P = mdxComponents.p as unknown as ComponentType<
      ComponentPropsWithoutRef<"p">
    >;
    const A = mdxComponents.a as unknown as ComponentType<
      ComponentPropsWithoutRef<"a">
    >;

    const { container } = await renderWithProvider(
      <P>
        <A href="https://example.com">
          <NotebookImage alt="Notebook sample" src="/test.png" />
        </A>
      </P>,
    );

    expect(container.querySelector("p")).toBeNull();
    expect(container.querySelector("figure")).not.toBeNull();

    const links = Array.from(container.querySelectorAll("a"));
    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute("href")).toBe("https://example.com");
    expect(links[0]?.getAttribute("target")).toBe("_blank");
  });

  it("replaces a Twitter/X status link with TweetEmbed", async () => {
    const P = mdxComponents.p as unknown as ComponentType<
      ComponentPropsWithoutRef<"p">
    >;
    const A = mdxComponents.a as unknown as ComponentType<
      ComponentPropsWithoutRef<"a">
    >;

    const { container } = await renderWithProvider(
      <P>
        <A href="https://twitter.com/silverbirder/status/1318861346327252993">
          https://twitter.com/silverbirder/status/1318861346327252993
        </A>
      </P>,
    );

    expect(container.querySelector("p")).toBeNull();
    const embed = container.querySelector('[data-embed="tweet"]');
    expect(embed).not.toBeNull();
    expect(embed?.getAttribute("data-tweet-id")).toBe("1318861346327252993");
  });

  it("keeps heading anchor links unstyled and internal", async () => {
    const A = mdxComponents.a as unknown as ComponentType<
      ComponentPropsWithoutRef<"a">
    >;

    const { container } = await renderWithProvider(
      <A className="mdx-heading-anchor" href="#heading">
        Heading
      </A>,
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("#heading");
    expect(link?.getAttribute("target")).toBeNull();
    expect(link?.getAttribute("class")).toContain("mdx-heading-anchor");
    expect(container.querySelector("svg")).toBeNull();
  });
});

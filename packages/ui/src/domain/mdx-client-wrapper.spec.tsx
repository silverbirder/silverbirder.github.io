import { MDXClient } from "next-mdx-remote-client";
import { describe, expect, it } from "vitest";

import { MdxClientWrapper } from "./mdx-client-wrapper";
import { mdxComponents } from "./mdx-components";

describe("MdxClientWrapper", () => {
  it("passes compiledSource and components to MDXClient", () => {
    const element = MdxClientWrapper({ compiledSource: "<p>hello</p>" });

    expect(element.type).toBe(MDXClient);
    expect(element.props.compiledSource).toBe("<p>hello</p>");
    expect(element.props.components).toBe(mdxComponents);
  });
});

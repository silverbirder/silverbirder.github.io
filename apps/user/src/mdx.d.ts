import type { MDXComponents } from "mdx/types";
import type { JSX } from "react";

declare module "*.md" {
  const MDXComponent: (props: { components?: MDXComponents }) => JSX.Element;
  export default MDXComponent;
  export const frontmatter: Record<string, unknown>;
}

import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import process from "node:process";

import { env } from "./src/env.js";

/** @type {import('next').NextConfig} */
const config = {
  assetPrefix: process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH || "",
  basePath: process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH || "",
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    viewTransition: true,
  },
  images: {
    unoptimized: true,
  },
  output: "export",
  reactCompiler: true,
  staticPageGenerationTimeout: 3600,
  trailingSlash: true,
  typedRoutes: true,
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    rehypePlugins: [
      [
        "rehype-raw",
        {
          passThrough: ["mdxjsEsm"],
        },
      ],
    ],
    remarkPlugins: [
      "remark-frontmatter",
      "remark-mdx-frontmatter",
      "remark-gfm",
    ],
  },
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

void env;

export default withNextIntl(withMDX(config));

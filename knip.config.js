/** @type {import('knip').KnipConfig} */
const appEntry = [
  "src/app/**/{page,layout,route,template,loading,error,not-found,default}.{ts,tsx}",
  "src/app/**/{icon,apple-icon,opengraph-image,manifest,robots,sitemap}.{ts,tsx}",
  "src/**/*.spec.{ts,tsx}",
  "next.config.js",
  "eslint.config.js",
  "vitest.config.ts",
];

const appProject = ["src/**/*.{ts,tsx,js,mjs,cjs}"];

const packageEntry = [
  "src/index.ts",
  "src/**/*.spec.{ts,tsx}",
  "src/**/*.test.{ts,tsx}",
  "src/**/*.stories.{ts,tsx,mdx}",
  "src/**/*.d.ts",
  "vitest.config.ts",
  "eslint.config.*",
];

const packageProject = ["src/**/*.{ts,tsx,js,mjs,cjs}"];

module.exports = {
  includeEntryExports: true,
  ignoreFiles: [
    "**/node_modules/**",
    "**/.next/**",
    "**/.turbo/**",
    "**/dist/**",
    "**/out/**",
    "**/tmp/**",
    "apps/admin/src/server/better-auth/client.ts",
    "turbo/generators/**",
  ],
  ignoreIssues: {
    "packages/typescript-config/nextjs.json": ["unresolved"],
    "apps/admin/src/server/api/trpc.ts": ["exports"],
    "apps/admin/src/trpc/react.tsx": ["exports", "types"],
    "apps/admin/src/trpc/server.ts": ["exports"],
    "apps/admin/src/server/better-auth/config.ts": ["types"],
    "apps/user/src/libs/posts/posts.ts": ["types"],
  },
  workspaces: {
    "apps/admin": {
      entry: appEntry,
      project: appProject,
    },
    "apps/user": {
      entry: [...appEntry, "src/mdx-components.tsx", "src/**/*.d.ts"],
      project: [...appProject, "src/**/*.d.ts"],
      ignoreDependencies: ["^@repo/content$"],
    },
    "packages/*": {
      entry: packageEntry,
      project: packageProject,
    },
    "packages/content": {
      entry: ["scripts/**/*.mjs"],
      project: ["scripts/**/*.mjs"],
    },
    "packages/message": {
      entry: ["index.ts"],
      project: ["index.ts"],
    },
    "packages/metadata": {
      entry: ["src/index.ts", "src/**/*.spec.{ts,tsx}"],
      project: ["src/**/*.{ts,tsx}"],
    },
    "packages/storybook": {
      entry: [".storybook/**/*.{ts,tsx}", "vitest.config.ts", "eslint.config.mjs"],
      project: [".storybook/**/*.{ts,tsx}"],
    },
    "packages/util": {
      entry: ["src/index.ts", "src/**/*.spec.{ts,tsx}"],
      project: ["src/**/*.{ts,tsx}"],
    },
    "packages/vitest-config": {
      entry: ["*.{js,mjs,cjs}"],
      project: ["*.{js,mjs,cjs}"],
    },
  },
};

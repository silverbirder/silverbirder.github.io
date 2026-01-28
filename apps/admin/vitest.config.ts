import { createNodeConfig } from "@repo/vitest-config/node";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default createNodeConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
  test: {
    include: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
  },
});

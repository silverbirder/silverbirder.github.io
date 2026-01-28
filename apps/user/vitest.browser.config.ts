import { createBrowserConfig } from "@repo/vitest-config/browser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default createBrowserConfig({
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
  test: {
    exclude: ["src/**/*.spec.ts"],
    include: ["src/**/*.spec.tsx"],
  },
});

import { createBrowserConfig } from "@repo/vitest-config/browser";
import path from "node:path";

export default createBrowserConfig({
  resolve: {
    alias: {
      "next/image": path.resolve(
        __dirname,
        "./src/test-util/mock-next-image.tsx",
      ),
    },
  },
});

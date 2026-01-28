import { createStorybookConfig } from "@repo/vitest-config/storybook";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default createStorybookConfig({
  configDir: path.join(dirname, ".storybook"),
  setupFiles: [".storybook/vitest.setup.ts"],
});

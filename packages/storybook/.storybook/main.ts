import type { StorybookConfig } from "@storybook/nextjs-vite";

import { dirname } from "path";
import { fileURLToPath } from "url";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
const config: StorybookConfig = {
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-mcp"),
  ],
  features: {
    experimentalRSC: true,
  },
  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },
  stories: ["../../../packages/*/src/**/*.stories.tsx"],
  viteFinal: async (config) => {
    config.build ??= {};
    config.build.rollupOptions ??= {};
    config.build.chunkSizeWarningLimit = 2500;

    const previousOnWarn = config.build.rollupOptions.onwarn;
    config.build.rollupOptions.onwarn = (warning, warn) => {
      if (
        warning.code === "MODULE_LEVEL_DIRECTIVE" ||
        warning.code === "SOURCEMAP_ERROR"
      ) {
        return;
      }
      if (previousOnWarn) {
        previousOnWarn(warning, warn);
        return;
      }
      warn(warning);
    };

    return config;
  },
};
export default config;

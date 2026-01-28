import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

/**
 * @param {{
 *   configDir: string;
 *   setupFiles?: string[];
 *   passWithNoTests?: boolean;
 * }} options
 */
export const createStorybookConfig = ({
  configDir,
  setupFiles = [],
  passWithNoTests = true,
}) => {
  if (!configDir) {
    throw new Error("configDir is required");
  }

  return defineConfig({
    test: {
      passWithNoTests,
      projects: [
        {
          extends: true,
          plugins: [storybookTest({ configDir })],
          test: {
            browser: {
              enabled: true,
              headless: true,
              instances: [{ browser: "chromium" }],
              provider: playwright({}),
            },
            name: "storybook",
            setupFiles,
          },
        },
      ],
    },
  });
};

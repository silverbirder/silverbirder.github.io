import react from "@vitejs/plugin-react";
import nextjs from "vite-plugin-storybook-nextjs";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

/**
 * Shared Vitest Browser Mode configuration blueprint.
 * @type {import("vitest/config").ViteUserConfigExport}
 */
const baseConfig = {
  plugins: [react(), nextjs({ dir: "../../apps/user" })],
  define: {
    process: { env: { IS_TEST: "true" } },
  },
  test: {
    include: ["src/**/*.spec.{ts,tsx}"],
    passWithNoTests: true,
    setupFiles: ["@repo/vitest-config/setup"],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
};

/**
 * Factory helper so packages can extend the shared Browser Mode config.
 * @param {import("vitest/config").ViteUserConfigExport} overrides
 * @returns {import("vitest/config").ViteUserConfigExport}
 */
export const createBrowserConfig = (overrides = {}) =>
  defineConfig(mergeConfig(baseConfig, overrides));

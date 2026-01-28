import { defineConfig, mergeConfig } from "vitest/config";

/**
 * Shared Vitest Node Mode configuration blueprint.
 * @type {import("vitest/config").ViteUserConfigExport}
 */
const baseConfig = {
  test: {
    environment: "node",
    include: ["src/**/*.spec.{ts,tsx}"],
    passWithNoTests: true,
  },
};

/**
 * Factory helper so packages can extend the shared Node Mode config.
 * @param {import("vitest/config").ViteUserConfigExport} overrides
 * @returns {import("vitest/config").ViteUserConfigExport}
 */
export const createNodeConfig = (overrides = {}) =>
  defineConfig(mergeConfig(baseConfig, overrides));


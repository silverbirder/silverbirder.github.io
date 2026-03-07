import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

const require = createRequire(import.meta.url);

/**
 * Shared Vitest Browser Mode configuration blueprint.
 * @type {import("vitest/config").ViteUserConfigExport}
 */
const baseConfig = {
  plugins: [react()],
  define: {
    process: {
      env: {
        IS_TEST: "true",
        NEXT_PUBLIC_LIKES_API_URL: "https://example.test",
      },
    },
  },
  optimizeDeps: {
    include: ["sb-original/image-context", "sb-original/default-loader"],
  },
  resolve: {
    alias: {
      "next/navigation": require.resolve(
        "vite-plugin-storybook-nextjs/browser/mocks/navigation"
      ),
      "next/image": require.resolve(
        "vite-plugin-storybook-nextjs/browser/mocks/image"
      ),
      "sb-original/default-loader": require.resolve(
        "vite-plugin-storybook-nextjs/browser/mocks/image-default-loader"
      ),
      "sb-original/image-context": require.resolve(
        "vite-plugin-storybook-nextjs/browser/mocks/image-context"
      ),
    },
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
    alias: {
      "react/jsx-dev-runtime": require.resolve(
        "next/dist/compiled/react/jsx-dev-runtime.js"
      ),
      "react/jsx-runtime": require.resolve(
        "next/dist/compiled/react/jsx-runtime.js"
      ),
      react: require.resolve("next/dist/compiled/react"),
      "react-dom/server": require.resolve(
        "next/dist/compiled/react-dom/server.browser.js"
      ),
      "react-dom/test-utils": require.resolve(
        "next/dist/compiled/react-dom/cjs/react-dom-test-utils.production.js"
      ),
      "react-dom/cjs/react-dom.development.js": require.resolve(
        "next/dist/compiled/react-dom/cjs/react-dom.development.js"
      ),
      "react-dom/client": require.resolve(
        "next/dist/compiled/react-dom/client.js"
      ),
      "react-dom": require.resolve("next/dist/compiled/react-dom"),
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

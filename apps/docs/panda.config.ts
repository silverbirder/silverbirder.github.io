import { defineConfig } from "@pandacss/dev";
import { tokens } from "~/theme/tokens";
import { semanticTokens } from "~/theme/semantic-tokens";
import { textStyles } from "~/theme/text-styles";
import { layerStyles } from "~/theme/layer-styles";
import { globalCss } from "~/theme/global-css";

export default defineConfig({
  watch: true,

  jsxFramework: "qwik",

  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  optimize: true,
  minify: true,
  hash: true,

  // Files to exclude
  exclude: [],

  conditions: {
    extend: {
      dark: '.dark &, [data-theme="dark"] &',
      light: ".light &",
      supportsBackdrop:
        "@supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px)))",
    },
  },
  theme: {
    extend: {
      breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      semanticTokens,
      tokens,
      textStyles,
      layerStyles,
      keyframes: {
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadein2: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeout: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  globalCss,

  // The output directory for your css system
  outdir: "src/styled-system",
});

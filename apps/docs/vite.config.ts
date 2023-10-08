import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { partytownVite } from "@builder.io/partytown/utils";
import { join } from "path";
import { macroPlugin } from "@builder.io/vite-plugin-macro";
import { qwikSpeakInline } from "qwik-speak/inline";

export default defineConfig(() => {
  return {
    plugins: [
      macroPlugin({ preset: "pandacss" }),
      qwikCity(),
      qwikVite(),
      qwikSpeakInline({
        supportedLangs: ["ja-JP", "en-US"],
        defaultLang: "ja-JP",
        assetsPath: "i18n",
      }),
      tsconfigPaths(),
      partytownVite({ dest: join(__dirname, "dist", "~partytown") }),
    ],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});

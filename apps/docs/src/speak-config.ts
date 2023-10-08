import type { SpeakConfig } from "qwik-speak";

export const config: SpeakConfig = {
  defaultLocale: {
    lang: "ja-JP",
    currency: "JPY",
    timeZone: "Asia/Tokyo",
  },
  supportedLocales: [
    { lang: "ja-JP", currency: "JPY", timeZone: "Asia/Tokyo" },
    { lang: "en-US", currency: "USD", timeZone: "America/Los_Angeles" },
  ],
  assets: [
    "app", // Translations shared by the pages
  ],
//   runtimeAssets: [
//     "runtime", // Translations with dynamic keys or parameters
//   ],
};

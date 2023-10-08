import { component$, useVisibleTask$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { QwikSpeakProvider } from "qwik-speak";
import { config } from "./speak-config";
import { translationFn } from "./speak-functions";
import { RouterHead } from "./components/router-head/router-head";
import { QwikPartytown } from "./components/partytown/partytown";
import "~/global.css";

export default component$(() => {
  useVisibleTask$(async () => {
    const { default: Tracker } = await import("@openreplay/tracker");
    const { default: trackerAssist } = await import(
      "@openreplay/tracker-assist"
    );
    const tracker = new Tracker({
      projectKey: import.meta.env.PUBLIC_OPEN_REPLAY_PROJECT_KEY,
      __DISABLE_SECURE_MODE: true,
    });
    tracker.use(trackerAssist());
    tracker.start();
  });
  return (
    <QwikSpeakProvider config={config} translationFn={translationFn}>
      <QwikCityProvider>
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <QwikPartytown forward={["dataLayer.push"]} />
          <script
            async
            type="text/partytown"
            src="https://www.googletagmanager.com/gtag/js?id=G-QV2CWHGJB6"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <RouterHead />
        </head>
        <body lang="ja">
          <RouterOutlet />
          <ServiceWorkerRegister />
        </body>
      </QwikCityProvider>
    </QwikSpeakProvider>
  );
});

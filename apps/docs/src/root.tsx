import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { QwikSpeakProvider, Speak } from "qwik-speak";
import { config } from "./speak-config";
import { translationFn } from "./speak-functions";
import { RouterHead } from "./components/router-head/router-head";
import { QwikPartytown } from "./components/partytown/partytown";
import { OpenReplay } from "./components/open-replay/open-replay";
import "~/global.css";
import { OneSignal } from "./components/one-signal/one-signal";

export default component$(() => {
  return (
    <QwikSpeakProvider config={config} translationFn={translationFn}>
      <QwikCityProvider>
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <script
            dangerouslySetInnerHTML="
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PDGFS772');
            "
          />
          <QwikPartytown forward={["gtag", "dataLayer.push"]} />
          <script
            async
            type="text/partytown"
            src="https://www.googletagmanager.com/gtag/js?id=G-V6PXKPV3CQ"
          />
          <script
            type="text/partytown"
            dangerouslySetInnerHTML="
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-V6PXKPV3CQ');
            "
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
          <link
            rel="alternate"
            type="application/rss+xml"
            title="silverbirder's blog (Japanese)"
            href="/feed.xml"
          />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="silverbirder's blog (English)"
            href="/en-US/feed.xml"
          />
          <OpenReplay />
          <Speak assets={["notification"]}>
            <OneSignal />
          </Speak>
          <RouterHead />
        </head>
        <body lang="ja">
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PDGFS772"
              height="0"
              width="0"
              style="display:none;visibility:hidden"
            ></iframe>
          </noscript>
          <RouterOutlet />
          <ServiceWorkerRegister />
        </body>
      </QwikCityProvider>
    </QwikSpeakProvider>
  );
});

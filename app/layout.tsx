import "./global.css";
import "highlight.js/styles/github-dark.css";
import type { Metadata } from "next";
import { Zen_Kurenaido } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import { GoogleAnalytics } from "@next/third-parties/google";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "silverbirder",
    template: "%s | silverbirder",
  },
  description: "@silverbirderのコジンノート",
  openGraph: {
    title: "silverbirder",
    description: "@silverbirderのコジンノート",
    url: baseUrl,
    siteName: "silverbirder",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: `/opengraph-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [{ rel: "icon", url: "/favicon.svg" }],
  keywords: ["silverbirder", "個人サイト", "ブログ", "Webエンジニア"],
};

const noto = Zen_Kurenaido({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});

const cx = (...classes) => classes.filter(Boolean).join(" ");

const OpenReplayNoSSR = dynamic(() => import("@/lib/open-replay"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="ja" className={cx("bg-background", noto.className)}>
        <head>
          <link
            rel="apple-touch-icon"
            type="image/png"
            href="/apple-touch-icon.png"
          />
          <link rel="icon" type="image/png" href="/icon-192x192.png" />
        </head>
        <body className={cx("antialiased max-w-4xl mx-auto p-4")}>
          <main className="flex-auto flex flex-col">
            {children}
            <Footer />
            {process.env.GA_ID && <GoogleAnalytics gaId={process.env.GA_ID} />}
            <OpenReplayNoSSR />
          </main>
        </body>
      </html>
    </ViewTransitions>
  );
}

import type { Metadata } from "next";

import { GoogleAnalytics } from "@next/third-parties/google";
import { createSiteMetadata } from "@repo/metadata";
import { Provider, UserLayout } from "@repo/ui";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Noto_Sans_JP } from "next/font/google";
import { Suspense, ViewTransition } from "react";

export const metadata: Metadata = createSiteMetadata();

const notoSansJP = Noto_Sans_JP({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
  const messages = await getMessages();
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <Provider>
          <NextIntlClientProvider messages={messages}>
            <ViewTransition>
              <Suspense fallback={null}>
                <UserLayout>{children}</UserLayout>
              </Suspense>
            </ViewTransition>
          </NextIntlClientProvider>
        </Provider>
        {process.env.GA_ID && <GoogleAnalytics gaId={process.env.GA_ID} />}
      </body>
    </html>
  );
}

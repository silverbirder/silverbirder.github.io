import type { Metadata } from "next";

import { GoogleAnalytics } from "@next/third-parties/google";
import { createSiteMetadata } from "@repo/metadata";
import { Provider, UserLayout } from "@repo/ui";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Klee_One } from "next/font/google";
import { Suspense, ViewTransition } from "react";

import { ClarityScript } from "./clarity";

export const metadata: Metadata = createSiteMetadata();

const kleeOne = Klee_One({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-klee-one",
  weight: ["400", "600"],
});

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
  const messages = await getMessages();
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${kleeOne.className} ${kleeOne.variable}`}>
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
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <ClarityScript
            projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}
          />
        )}
      </body>
    </html>
  );
}

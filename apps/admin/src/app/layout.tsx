import { Provider } from "@repo/ui";
import { type Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Klee_One } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  description: "記事を執筆して公開するための管理画面",
  title: "執筆場",
};

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
          <TRPCReactProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </TRPCReactProvider>
        </Provider>
      </body>
    </html>
  );
}

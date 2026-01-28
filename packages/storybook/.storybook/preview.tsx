import type { Preview } from "@storybook/nextjs-vite";

import { jaMessages } from "@repo/message";
import { Provider } from "@repo/ui";
import { NextIntlClientProvider } from "next-intl";
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <Provider>
        <NextIntlClientProvider locale="ja" messages={jaMessages}>
          <div className={notoSansJP.className}>
            <Story />
          </div>
        </NextIntlClientProvider>
      </Provider>
    ),
  ],
  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "error",
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;

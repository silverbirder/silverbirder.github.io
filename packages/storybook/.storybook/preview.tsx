import type { Preview } from "@storybook/nextjs-vite";

import { jaMessages } from "@repo/message";
import { Provider } from "@repo/ui";
import { NextIntlClientProvider } from "next-intl";
import { Klee_One } from "next/font/google";

const kleeOne = Klee_One({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-klee-one",
  weight: ["400", "600"],
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <Provider>
        <NextIntlClientProvider locale="ja" messages={jaMessages}>
          <div className={`${kleeOne.className} ${kleeOne.variable}`}>
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

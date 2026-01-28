import type { Preview } from "@storybook/nextjs-vite";

import { jaMessages } from "@repo/message";
import { Provider } from "@repo/ui/chakra";
import { NextIntlClientProvider } from "next-intl";

const preview: Preview = {
  decorators: [
    (Story) => (
      <Provider>
        <NextIntlClientProvider locale="ja" messages={jaMessages}>
          <div
            style={{
              fontFamily:
                '"Noto Sans JP", "Hiragino Sans", "Noto Sans", "Helvetica Neue", Arial, sans-serif',
            }}
          >
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

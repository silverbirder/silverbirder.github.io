import type { ReactNode } from "react";

import { jaMessages } from "@repo/message";
import { NextIntlClientProvider } from "next-intl";
import { render } from "vitest-browser-react";

import { Provider } from "../chakra/provider";

type RenderWithProviderOptions = {
  locale?: string;
  messages?: typeof jaMessages;
};

export const renderWithProvider = (
  ui: ReactNode,
  { locale = "ja", messages = jaMessages }: RenderWithProviderOptions = {},
) => {
  return render(
    <Provider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {ui}
      </NextIntlClientProvider>
    </Provider>,
  );
};

"use client";

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
  Theme,
} from "@chakra-ui/react";
import { ThemeProvider, type ThemeProviderProps } from "next-themes";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: "var(--font-klee-one), sans-serif" },
        heading: { value: "var(--font-klee-one), sans-serif" },
      },
    },
  },
});
const system = createSystem(defaultConfig, config);

type Props = ThemeProviderProps;

export const Provider = ({
  attribute,
  children,
  defaultTheme = "light",
  disableTransitionOnChange = true,
  enableSystem = false,
  forcedTheme = "light",
  ...props
}: Props) => {
  return (
    <ThemeProvider
      attribute={attribute ?? "class"}
      defaultTheme={defaultTheme}
      disableTransitionOnChange={disableTransitionOnChange}
      enableSystem={enableSystem}
      forcedTheme={forcedTheme}
      {...props}
    >
      <ChakraProvider value={system}>
        <Theme colorPalette="green">{children}</Theme>
      </ChakraProvider>
    </ThemeProvider>
  );
};

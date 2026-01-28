"use client";

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
  Theme,
} from "@chakra-ui/react";
import { ThemeProvider, type ThemeProviderProps } from "next-themes";

const config = defineConfig({});
const system = createSystem(defaultConfig, config);

type Props = ThemeProviderProps;

export const Provider = ({
  attribute,
  children,
  defaultTheme = "system",
  disableTransitionOnChange = true,
  enableSystem = true,
  ...props
}: Props) => {
  return (
    <ThemeProvider
      attribute={attribute ?? "class"}
      defaultTheme={defaultTheme}
      disableTransitionOnChange={disableTransitionOnChange}
      enableSystem={enableSystem}
      {...props}
    >
      <ChakraProvider value={system}>
        <Theme colorPalette="green">{children}</Theme>
      </ChakraProvider>
    </ThemeProvider>
  );
};

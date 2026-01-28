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

export const Provider = ({ attribute, children, ...props }: Props) => {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute={attribute ?? "class"} {...props}>
        <Theme colorPalette="green">{children}</Theme>
      </ThemeProvider>
    </ChakraProvider>
  );
};

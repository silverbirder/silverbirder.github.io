import { defineSemanticTokens } from "@pandacss/dev";

export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      main: {
        value: {
          base: "{colors.white}",
          _dark: "{colors.black}",
        },
      },
      muted: {
        value: {
          base: "{colors.gray.900}",
          _dark: "{colors.gray.400}",
        },
      },
      quote: {
        value: {
          base: "{colors.gray.100}",
          _dark: "{colors.gray.800}",
        },
      },
      dark: {
        value: {
          base: "{colors.black}",
          _dark: "{colors.gray.400}",
        },
      },
      inverted: {
        value: { base: "{colors.white}", _dark: "{colors.black}" },
      },
      emphasized: {
        value: { base: "{colors.white}", _dark: "{colors.yellow.300}" },
      },
      "emphasized.hover": {
        value: {
          base: "{colors.gray.100}",
          _dark: "{colors.gray.800}",
        },
      },
    },
    text: {
      main: {
        value: { base: "{colors.black}", _dark: "{colors.white}" },
      },
      headline: {
        value: { base: "{colors.black}", _dark: "{colors.yellow.300}" },
      },
      muted: {
        value: {
          base: "{colors.gray.800}",
          _dark: "{colors.gray.50}",
        },
      },
      link: {
        value: { base: "{colors.blue.800}", _dark: "{colors.blue.800}" },
      },
      linkActive: {
        value: { base: "{colors.blue.950}", _dark: "{colors.blue.800}" },
      },
    },
  },
  sizes: {
    icon: {
      main: {
        value: {
          base: "{sizes.4xl}",
          _dark: "{sizes.4xl}",
        },
      },
      mini: {
        value: {
          base: "{sizes.2xl}",
          _dark: "{sizes.2xl}",
        },
      },
    },
    avatar: {
      main: {
        value: {
          base: "{sizes.8xl}",
          _dark: "{sizes.8xl}",
        },
      },
    },
    header: {
      main: {
        value: {
          base: "{sizes.5xl}",
          _dark: "{sizes.5xl}",
        },
      },
    },
  },
  radii: {
    tag: {
      main: {
        value: {
          base: "{radii.xl}",
          _dark: "{radii.xl}",
        },
      },
    },
  },
});

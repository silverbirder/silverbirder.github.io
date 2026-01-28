import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import React from "react";
import { vi } from "vitest";

import * as projectAnnotations from "./preview";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    alt,
    src,
    ...props
  }: {
    alt?: string;
    src: string | { src: string };
  }) => {
    const resolvedSrc = typeof src === "string" ? src : src.src;
    // Render a plain img in Storybook tests to avoid Next.js runtime constraints.
    return React.createElement("img", { alt, src: resolvedSrc, ...props });
  },
}));

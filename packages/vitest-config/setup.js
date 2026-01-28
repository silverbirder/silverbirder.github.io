import "vitest-browser-react";
import { setProjectAnnotations } from "@storybook/nextjs-vite";

import preview from "../storybook/.storybook/preview-test";

setProjectAnnotations(preview);

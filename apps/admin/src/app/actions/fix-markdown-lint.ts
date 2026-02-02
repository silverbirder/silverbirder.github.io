import { applyFixes } from "markdownlint";
import { lint as lintSync } from "markdownlint/sync";

export const fixMarkdownLint = async (source: string) => {
  "use server";

  if (!source) {
    return source;
  }
  try {
    const results = lintSync({
      config: {
        default: true,
        MD013: false,
        MD033: {
          allowed_elements: ["iframe"],
        },
        MD034: false,
        MD041: false,
      },
      strings: {
        content: source,
      },
    });
    const errors = results?.content ?? [];
    return applyFixes(source, errors);
  } catch {
    return source;
  }
};

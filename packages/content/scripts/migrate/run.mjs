import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

const steps = [
  "mdx-to-md.mjs",
  "mdx-image-to-markdown.mjs",
  "add-summary-from-body.mjs",
  "escape-frontmatter-quotes.mjs",
  "fix-md036-no-emphasis-as-heading.mjs",
  "fix-md025-single-title.mjs",
  "fix-md001-heading-increment.mjs",
  "fix-md026-no-trailing-punctuation.mjs",
  "fix-md038-no-space-in-code.mjs",
  "fix-md009-no-trailing-spaces.mjs",
  "fix-md014-commands-show-output.mjs",
  "fix-md007-ul-indent.mjs",
  "fix-md030-list-marker-space.mjs",
  "fix-md029-ol-prefix.mjs",
  "fix-md032-blanks-around-lists.mjs",
  "fix-md022-blanks-around-headings.mjs",
  "fix-md028-no-blanks-blockquote.mjs",
  "fix-md024-no-duplicate-heading.mjs",
  "fix-md033-no-inline-html.mjs",
  "fix-md040-fenced-code-language.mjs",
  "fix-md012-no-multiple-blanks.mjs",
  "fix-md045-no-alt-text.mjs",
  "fix-md047-single-trailing-newline.mjs",
  "normalize-tags.mjs",
];

let exitCode = 0;

for (const step of steps) {
  const scriptPath = path.join(scriptDir, step);
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    exitCode = result.status ?? 1;
    break;
  }
}

process.exit(exitCode);

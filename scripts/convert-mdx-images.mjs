#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

function parseAttr(attrStr, name) {
  const re = new RegExp(name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|\\{\s*\"([^\"]*)\"\s*\\}|\\{\s*'([^']*)'\s*\\})");
  const m = attrStr.match(re);
  if (!m) return null;
  return m[1] ?? m[2] ?? m[3] ?? m[4] ?? null;
}

async function processFile(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  let src = await fs.readFile(abs, 'utf8');
  let count = 0;

  // Matches <Image .../> or <Image ...> (self-closing or not). We'll only replace the opening tag occurrence.
  const imgTagRe = /<Image\b([^>]*)\/>/g;

  src = src.replace(imgTagRe, (full, attrStr) => {
    const srcVal = parseAttr(attrStr, 'src');
    const altVal = parseAttr(attrStr, 'alt');
    const hrefVal = parseAttr(attrStr, 'href');

    if (!srcVal) {
      // Can't convert if src is not a string literal
      return full;
    }

    const altText = altVal ?? '';
    const mdImg = `![${altText}](${srcVal})`;
    const result = hrefVal ? `[${mdImg}](${hrefVal})` : mdImg;
    count++;
    return result;
  });

  // Also handle cases where Image tag is not self-closing: <Image ...></Image>
  const imgTagRe2 = /<Image\b([^>]*)>(?:[\s\S]*?)<\/Image>/g;
  src = src.replace(imgTagRe2, (full, attrStr) => {
    const srcVal = parseAttr(attrStr, 'src');
    const altVal = parseAttr(attrStr, 'alt');
    const hrefVal = parseAttr(attrStr, 'href');
    if (!srcVal) return full;
    const altText = altVal ?? '';
    const mdImg = `![${altText}](${srcVal})`;
    const result = hrefVal ? `[${mdImg}](${hrefVal})` : mdImg;
    count++;
    return result;
  });

  if (count > 0) {
    await fs.writeFile(abs, src, 'utf8');
  }

  return { file: filePath, replacements: count };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node scripts/convert-mdx-images.mjs <file1.mdx> [file2.mdx ...]');
    process.exitCode = 2;
    return;
  }

  const results = [];
  for (const f of args) {
    try {
      const r = await processFile(f);
      results.push(r);
      console.log(`Processed ${f}: ${r.replacements} replacement(s)`);
    } catch (err) {
      console.error(`Error processing ${f}:`, err.message || err);
    }
  }

  const total = results.reduce((s, r) => s + r.replacements, 0);
  console.log(`Done. Total replacements: ${total}`);
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('convert-mdx-images.mjs')) {
  main();
}

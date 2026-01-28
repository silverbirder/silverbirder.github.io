---
title: 'OGPのテキストを任意の行で省略する、lineClampとbudoux'
publishedAt: '2025-02-06'
summary: 'ブログ記事のOGP画像に、ブログタイトルを入れたい場面があります。その際、タイトルが長い場合は複数行に分けたり、省略したりする必要があります。今回は、試してみてよさそうだった2つの方法を紹介します。'
tags: ["ブラウザ"]
index: false
---

ブログ記事のOGP画像に、ブログタイトルを入れたい場面があります。その際、タイトルが長い場合は複数行に分けたり、省略したりする必要があります。
今回は、試してみてよさそうだった2つの方法を紹介します。

## 前提

- OGP画像の生成には、`vercel/og (satori)` を使用します
  - [Next.jsのopengraph-image.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)ファイルを使います

## 1. lineClampを使う方法

最もシンプルな方法として、`satori` の `lineClamp` 機能を使用する方法があります。

- https://github.com/vercel/satori#css

この機能を使うと、簡単に複数行の表示と省略が可能です。
また、省略時の文字をカスタマイズすることもできます。以下は、その実装例です。

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "alt";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const WAGAHAI_IS_CAT =
  "吾輩は猫である。名前はまだない。どこで生れたか頓（とん）と見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪（どうあく）な種族であったそうだ。この書生というのは時々我々を捕（つかま）えて煮て食うという話である。しかしその当時は何という考（かんがえ）もなかったから別段恐しいとも思わなかった。";

export default async function Image() {
  const text = WAGAHAI_IS_CAT;

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          padding: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "block",
            lineClamp: 3,
            fontSize: "24px",
            lineHeight: "1.5",
            textAlign: "left",
          }}
        >
          {text}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
```

以下の画像が、`lineClamp` を使用した OGP 画像の例です。

![lineClamp](https://res.cloudinary.com/silverbirder/image/upload/v1738842539/silver-birder.github.io/blog/WAGAHAI_IS_CAT_simple.png)

## 2. budouxを使う方法

`lineClamp` では改行位置が不自然になることがあります。
そんなときに、日本語向けの `budoux` を使うと、適切な位置で改行できます。

- https://github.com/google/budoux

以下の方法で `budoux` を OGP 画像の生成に活用できます。
改行位置を調整しながら、最大行数を超えた場合は `...` を追加して省略するようにしています。

```tsx
import { ImageResponse } from "next/og";
import { Parser, jaModel } from "budoux";

const parser = new Parser(jaModel);

export const runtime = "edge";
export const alt = "alt";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const PADDING = 200;
const FONT_SIZE = 24;
const MAX_LINES = 3;
const CONTENT_WIDTH = size.width - PADDING * 2;
const AVERAGE_CHAR_WIDTH = FONT_SIZE;
const MAX_CHARS_PER_LINE = Math.floor(CONTENT_WIDTH / AVERAGE_CHAR_WIDTH);
const WAGAHAI_IS_CAT =
  "吾輩は猫である。名前はまだない。どこで生れたか頓（とん）と見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪（どうあく）な種族であったそうだ。この書生というのは時々我々を捕（つかま）えて煮て食うという話である。しかしその当時は何という考（かんがえ）もなかったから別段恐しいとも思わなかった。";

export default async function Image() {
  const text = WAGAHAI_IS_CAT;
  const lines = splitTextIntoLines(text, MAX_LINES, MAX_CHARS_PER_LINE);

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          padding: `${PADDING}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {lines.map((line, index) => (
          <div
            key={index}
            style={{
              fontSize: `${FONT_SIZE}px`,
              lineHeight: "1.5",
              textAlign: "left",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    ),
    {
      ...size,
    }
  );
}

/**
 * テキストを指定した行数と文字数で分割し、必要に応じて省略記号を追加する関数
 * @param text - 分割するテキスト
 * @param maxLines - 最大行数
 * @param maxCharsPerLine - 1行あたりの最大文字数
 * @returns - 分割されたテキストの配列
 */
function splitTextIntoLines(
  text: string,
  maxLines: number,
  maxCharsPerLine: number
) {
  const parsedText = parser.parse(text);
  const lines = [];
  let currentLine = "";

  parsedText.forEach((segment) => {
    if (currentLine.length + segment.length <= maxCharsPerLine) {
      currentLine += segment;
    } else {
      lines.push(currentLine);
      currentLine = segment;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    lines[maxLines - 1] =
      lines[maxLines - 1].slice(0, maxCharsPerLine - 3) + "...";
    lines.length = maxLines;
  }

  return lines;
}
```

以下の画像が、`budoux` を使用した OGP 画像の例です。

![budoux](https://res.cloudinary.com/silverbirder/image/upload/v1738842539/silver-birder.github.io/blog/WAGAHAI_IS_CAT_budoux.png)

## 終わりに

`lineClamp` を使う方法と `budoux` を使う方法を紹介しました。
OGP画像生成で悩んでいる人のお役に立てれば嬉しいです。

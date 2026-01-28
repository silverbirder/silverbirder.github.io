import { siteThemeColor } from "@repo/metadata";
import { jaModel, Parser } from "budoux";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

import { getPostFrontmatter, getPostSlugs } from "@/libs";

export const dynamic = "force-static";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

const NOTEBOOK_LINE_HEIGHT = 32; // 2rem
const NOTEBOOK_LINE_COLOR = "#f4f4f5"; // var(--chakra-colors-border-muted)

const FONT_SIZE = 40;
const MAX_LINES = 3;
const CONTENT_WIDTH = size.width - NOTEBOOK_LINE_HEIGHT * 2;
const AVERAGE_CHAR_WIDTH = FONT_SIZE;
const MAX_CHARS_PER_LINE = Math.floor(CONTENT_WIDTH / AVERAGE_CHAR_WIDTH);

const budouxParser = new Parser(jaModel);

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export default async function OpenGraphImage(props: {
  params: Promise<{ slug: string }>;
}) {
  const logo = await readFile(
    new URL("../../../../../public/assets/logo.png", import.meta.url),
  );
  const notoSansJpRegular = await readFile(
    new URL(
      "../../../../../public/fonts/NotoSansJP-Regular.ttf",
      import.meta.url,
    ),
  );
  const notoSansJpBold = await readFile(
    new URL("../../../../../public/fonts/NotoSansJP-Bold.ttf", import.meta.url),
  );
  const logoBase64 = `data:image/png;base64,${logo.toString("base64")}`;

  const { slug } = await props.params;

  let title = "";
  try {
    const frontmatter = await getPostFrontmatter(slug);
    title = frontmatter.title ?? "";
  } catch {
    notFound();
  }

  if (!title) {
    notFound();
  }

  const titleLines = await splitTextIntoLines(
    title,
    MAX_LINES,
    MAX_CHARS_PER_LINE,
  );

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#fff",
        backgroundImage: `linear-gradient(${NOTEBOOK_LINE_COLOR} 1px, transparent 1px)`,
        backgroundSize: `100% ${NOTEBOOK_LINE_HEIGHT}px`,
        border: `${NOTEBOOK_LINE_HEIGHT}px solid ${siteThemeColor}`,
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Noto Sans JP"',
        gap: `${NOTEBOOK_LINE_HEIGHT}px`,
        height: "100%",
        justifyContent: "space-between",
        padding: `${NOTEBOOK_LINE_HEIGHT}px`,
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 0,
          justifyContent: "flex-start",
        }}
      >
        <img
          alt="silverbirder's avatar"
          height={`${NOTEBOOK_LINE_HEIGHT * 6}`}
          src={logoBase64}
          style={{
            backgroundColor: "#fff",
            border: `8px solid ${siteThemeColor}`,
            borderRadius: "50%",
            padding: "8px",
          }}
          width={`${NOTEBOOK_LINE_HEIGHT * 6}`}
        />
        <div
          style={{
            alignItems: "flex-start",
            color: "#52525b",
            display: "flex",
            flexDirection: "column",
            fontSize: `${FONT_SIZE}px`,
            fontWeight: 700,
            gap: 0,
            textAlign: "left",
          }}
        >
          {titleLines.map((line, index) => (
            <div
              key={`${line}-${index}`}
              style={{
                display: "flex",
                height: `${NOTEBOOK_LINE_HEIGHT * 2}px`,
                lineHeight: `${NOTEBOOK_LINE_HEIGHT * 2}px`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
      <p
        style={{
          color: "#52525b",
          fontSize: "24px",
          fontWeight: 400,
          height: `${NOTEBOOK_LINE_HEIGHT}px`,
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        ジブンノート / silverbirder
      </p>
    </div>,
    {
      ...size,
      fonts: [
        {
          data: notoSansJpRegular,
          name: "Noto Sans JP",
          style: "normal",
          weight: 400,
        },
        {
          data: notoSansJpBold,
          name: "Noto Sans JP",
          style: "normal",
          weight: 700,
        },
      ],
    },
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
  maxCharsPerLine: number,
) {
  const parsedText = budouxParser.parse(text);
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
    const idx = maxLines - 1;
    const last = lines[idx] ?? "";
    lines[idx] =
      Array.from(last)
        .slice(0, Math.max(0, maxCharsPerLine - 3))
        .join("") + "...";
    lines.length = maxLines;
  }

  return lines;
}

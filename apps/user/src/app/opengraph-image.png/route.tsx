import { siteThemeColor } from "@repo/metadata";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

export const dynamic = "force-static";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

const NOTEBOOK_LINE_HEIGHT = 32; // 2rem
const NOTEBOOK_LINE_COLOR = "#f4f4f5"; // var(--chakra-colors-border-muted)

export const buildOpenGraphImage = async () => {
  const logo = await readFile(
    new URL("../../../public/assets/logo.png", import.meta.url),
  );
  const notoSansJpRegular = await readFile(
    new URL("../../../public/fonts/NotoSansJP-Regular.ttf", import.meta.url),
  );
  const notoSansJpBold = await readFile(
    new URL("../../../public/fonts/NotoSansJP-Bold.ttf", import.meta.url),
  );
  const logoBase64 = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        backgroundColor: `#fff`,
        backgroundImage: `linear-gradient(${NOTEBOOK_LINE_COLOR} 1px, transparent 1px)`,
        backgroundSize: `100% ${NOTEBOOK_LINE_HEIGHT}px`,
        border: `${NOTEBOOK_LINE_HEIGHT}px solid ${siteThemeColor}`,
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Noto Sans JP"',
        gap: `${NOTEBOOK_LINE_HEIGHT}px`,
        height: "100%",
        justifyContent: "flex-start",
        padding: `${NOTEBOOK_LINE_HEIGHT}px`,
        width: "100%",
      }}
    >
      <img
        alt="silverbirder's avatar"
        height={`${NOTEBOOK_LINE_HEIGHT * 6}`}
        src={logoBase64}
        style={{
          backgroundColor: `#fff`,
          border: `8px solid ${siteThemeColor}`,
          borderRadius: "50%",
          padding: "8px",
        }}
        width={`${NOTEBOOK_LINE_HEIGHT * 6}`}
      />
      <h1
        style={{
          color: "#52525b",
          fontSize: "72px",
          fontWeight: 700,
          height: `${NOTEBOOK_LINE_HEIGHT * 2}px`,
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        ジブンノート
      </h1>
      <p
        style={{
          color: "#52525b",
          fontSize: "36px",
          fontWeight: 400,
          height: `${NOTEBOOK_LINE_HEIGHT}px`,
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        silverbirder
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
};

export async function GET() {
  return buildOpenGraphImage();
}

import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { baseUrl } from "@/sitemap";

const size = {
  width: 1200,
  height: 630,
};

export async function GET() {
  const fontData = await fs.promises.readFile(
    path.join(
      fileURLToPath(import.meta.url),
      "../../../public/ZenKurenaido-Regular.ttf"
    )
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "100% 24px",
          padding: "24px",
          fontFamily: "ZenKurenaido-Regular, sans-serif",
          position: "relative",
          border: "24px solid #00adb5",
          boxSizing: "border-box",
        }}
      >
        <img
          width="200"
          height="200"
          src={`${baseUrl}/android-chrome-512x512.png`}
          alt="silverbirder's avatar"
          style={{
            borderRadius: "50%",
            marginBottom: "24px",
            backgroundColor: "white",
            border: "8px solid #00adb5",
            padding: "8px",
          }}
        />
        <h1
          style={{
            fontSize: "72px",
            lineHeight: 1,
            color: "#0f172a",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          コジンノート
        </h1>
        <p
          style={{
            fontSize: "48px",
            lineHeight: 1,
            color: "#0f172a",
            textAlign: "center",
          }}
        >
          @silverbirder
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "ZenKurenaido-Regular",
          data: fontData,
        },
      ],
    }
  );
}

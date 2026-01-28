import { iconSizes } from "@repo/metadata";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const contentType = "image/png";

export { iconSizes };

type Props = {
  id: Promise<number>;
};

export function generateImageMetadata() {
  return iconSizes.map((size) => ({
    contentType,
    id: size,
    size: { height: size, width: size },
  }));
}

export default async function Icon({ id }: Props) {
  const size = await id;

  const logo = await readFile(
    new URL("../../public/assets/logo.png", import.meta.url),
  );
  const logoBase64 = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <img
        alt="silverbirder"
        height="100%"
        src={logoBase64}
        style={{ objectFit: "contain" }}
        width="100%"
      />
    </div>,
    {
      height: size,
      width: size,
    },
  );
}

import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const contentType = "image/png";
export const iconSizes = [32, 48, 72, 96, 144, 192, 512] as const;

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

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "white",
        display: "flex",
        fontSize: Math.floor(size * 0.75),
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {"📝"}
    </div>,
    {
      height: size,
      width: size,
    },
  );
}

import type { ImgHTMLAttributes } from "react";

type MockNextImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  blurDataURL?: string;
  fill?: boolean;
  loader?: unknown;
  overrideSrc?: string;
  placeholder?: string;
  quality?: number;
  src: string;
  unoptimized?: boolean;
};

const imageOnlyProps = new Set([
  "blurDataURL",
  "fill",
  "loader",
  "overrideSrc",
  "placeholder",
  "quality",
  "unoptimized",
]);

const MockNextImage = (props: MockNextImageProps) => {
  const imgProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !imageOnlyProps.has(key)),
  ) as ImgHTMLAttributes<HTMLImageElement>;

  return <img {...imgProps} />;
};

export default MockNextImage;

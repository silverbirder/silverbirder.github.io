const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

const isCloudinaryUploadUrl = (src) => {
  return (
    src.startsWith("http://res.cloudinary.com/") ||
    src.startsWith("https://res.cloudinary.com/")
  ) && src.includes(CLOUDINARY_UPLOAD_SEGMENT);
};

const stripNotebookImageMetadata = (url) => {
  url.searchParams.delete("ar");
  return url;
};

const withCloudinaryWidth = (src, width, quality) => {
  const url = stripNotebookImageMetadata(new URL(src));
  const [beforeUpload, afterUpload] = url.href.split(CLOUDINARY_UPLOAD_SEGMENT);

  if (!beforeUpload || !afterUpload) {
    return src;
  }

  const segments = afterUpload.split("/");
  const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));

  if (versionIndex < 0) {
    return src;
  }

  const assetPath = segments.slice(versionIndex).join("/");
  const transformedPath = `f_auto,c_limit,w_${width},q_${quality || "auto"}/${assetPath}`;
  const nextUrl = `${beforeUpload}${CLOUDINARY_UPLOAD_SEGMENT}${transformedPath}`;
  const query = url.searchParams.toString();

  return query ? `${nextUrl}?${query}` : nextUrl;
};

export default function imageLoader({ quality, src, width }) {
  if (isCloudinaryUploadUrl(src)) {
    return withCloudinaryWidth(src, width, quality);
  }

  return src;
}

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";
const CLOUDINARY_HOSTNAME = "res.cloudinary.com";

const parseUrl = (src) => {
  try {
    return new URL(src);
  } catch {
    return null;
  }
};

const isCloudinaryUploadUrl = (src) => {
  const url = parseUrl(src);
  return url?.hostname === CLOUDINARY_HOSTNAME &&
    url.pathname.includes(CLOUDINARY_UPLOAD_SEGMENT);
};

const normalizeCloudinaryProtocol = (src) => {
  const url = parseUrl(src);

  if (!url || url.hostname !== CLOUDINARY_HOSTNAME) {
    return src;
  }

  url.protocol = "https:";
  return url.toString();
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
  const normalizedSrc = normalizeCloudinaryProtocol(src);

  if (isCloudinaryUploadUrl(normalizedSrc)) {
    return withCloudinaryWidth(normalizedSrc, width, quality);
  }

  return normalizedSrc;
}

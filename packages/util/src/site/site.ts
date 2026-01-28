const DEFAULT_SITE_URL = "https://silverbirder.github.io";

const normalizeBasePath = (basePath: string | undefined) => {
  if (!basePath) {
    return "";
  }

  if (basePath === "/") {
    return "";
  }

  const withoutTrailingSlash = basePath.replace(/\/+$/, "");
  return withoutTrailingSlash.startsWith("/")
    ? withoutTrailingSlash
    : `/${withoutTrailingSlash}`;
};

const normalizeSiteUrl = (siteUrl: string | undefined) => {
  const target = siteUrl || DEFAULT_SITE_URL;
  return target.replace(/\/+$/, "");
};

const getSiteBasePath = () =>
  normalizeBasePath(process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH);

const getSiteBaseUrl = () => {
  const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const basePath = getSiteBasePath();
  return `${siteUrl}${basePath}/`;
};

export const getSiteMetadataBase = () => new URL(getSiteBaseUrl());

export const buildSiteUrl = (pathname: string) => {
  const normalizedPath = pathname.replace(/^\/+/, "");
  return new URL(normalizedPath, getSiteBaseUrl()).toString();
};

export const buildSitePath = (pathname: string) => {
  const basePath = getSiteBasePath();
  const normalizedPath = pathname.replace(/^\/+/, "");

  if (normalizedPath === "") {
    return basePath === "" ? "/" : `${basePath}/`;
  }

  return `${basePath}/${normalizedPath}`.replace(/\/{2,}/g, "/");
};

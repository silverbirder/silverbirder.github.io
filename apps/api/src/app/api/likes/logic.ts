export const normalizeSlug = (value: string) => value.trim().toLowerCase();

const parseOrigins = (value: string | undefined) => {
  if (!value) return [];
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const resolveCorsOrigin = (origin: null | string) => {
  if (!origin) return null;
  const allowedOrigins = parseOrigins(process.env.ALLOWED_ORIGINS);
  if (allowedOrigins.length === 0) {
    return origin;
  }
  return allowedOrigins.includes(origin) ? origin : null;
};

export const buildCorsHeaders = (origin: null | string) => {
  const resolvedOrigin = resolveCorsOrigin(origin);
  return {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Origin": resolvedOrigin ?? "",
    Vary: "Origin",
  } as const;
};

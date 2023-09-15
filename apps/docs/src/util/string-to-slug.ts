export const stringToSlug = (str: string): string =>
  str.toLowerCase().replace(/\s+/g, "-");

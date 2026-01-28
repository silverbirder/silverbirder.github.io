export const parseAllowedEmails = (rawValue?: string) =>
  (rawValue ?? "")
    .split(",")
    .map((value) => value.toLowerCase())
    .filter(Boolean);

export const isAllowedEmail = (
  email: null | string | undefined,
  allowedEmails: string[],
) => {
  if (!email) return false;
  return allowedEmails.includes(email.toLowerCase());
};

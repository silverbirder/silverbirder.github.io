import { redirect } from "next/navigation";

import { env } from "@/env";
import { isAllowedEmail, parseAllowedEmails } from "@/server/allowed-users";

type Session = null | { user?: { email?: string } };

export const redirectIfAllowed = (session: Session) => {
  const allowedEmails = parseAllowedEmails(env.ADMIN_ALLOWED_EMAILS);
  const isAllowed =
    !!session?.user && isAllowedEmail(session.user.email, allowedEmails);
  const result = { allowedEmails, isAllowed };

  if (session?.user && result.isAllowed) {
    redirect("/");
  }

  return result;
};

import { SignIn } from "@repo/admin-feature-sign-in";

import { handleSignIn, handleSignOut, redirectIfAllowed } from "@/app/actions";
import { getSession } from "@/server/better-auth/server";

export default async function SignInPage() {
  const session = await getSession();
  const { allowedEmails, isAllowed } = await redirectIfAllowed(session);

  const hasAllowList = allowedEmails.length > 0;
  const status = session?.user
    ? hasAllowList
      ? "forbidden"
      : "missingAllowList"
    : "default";

  return (
    <SignIn
      onSignIn={handleSignIn}
      onSignOut={session?.user && !isAllowed ? handleSignOut : undefined}
      status={status}
    />
  );
}

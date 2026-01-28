import { SignIn } from "@repo/admin-feature-sign-in";

import { handleSignIn } from "@/app/actions/sign-in";
import { redirectIfAllowed } from "@/app/actions/sign-in-access";
import { handleSignOut } from "@/app/actions/sign-out";
import { getSession } from "@/server/better-auth/server";

export default async function SignInPage() {
  const session = await getSession();
  const { allowedEmails, isAllowed } = redirectIfAllowed(session);

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

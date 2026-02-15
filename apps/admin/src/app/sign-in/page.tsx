import { SignIn } from "@repo/admin-feature-sign-in";

import { handleSignIn, handleSignOut, redirectIfAllowed } from "@/app/actions";
import { getSession } from "@/server/better-auth/server";

export default async function SignInPage() {
  const session = await getSession();
  await redirectIfAllowed(session);

  return (
    <SignIn
      onSignIn={handleSignIn}
      onSignOut={session?.user ? handleSignOut : undefined}
    />
  );
}

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/server/better-auth";

export const handleSignOut = async () => {
  "use server";
  await auth.api.signOut({ headers: await headers() });
  redirect("/sign-in");
};

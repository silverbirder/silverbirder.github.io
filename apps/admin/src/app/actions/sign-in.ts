import type { Route } from "next";

import { redirect } from "next/navigation";

import { auth } from "@/server/better-auth";

export const handleSignIn = async () => {
  "use server";
  const res = await auth.api.signInSocial({
    body: {
      callbackURL: "/",
      provider: "github",
    },
  });
  if (!res.url) {
    throw new Error("No URL returned from signInSocial");
  }
  redirect(res.url as Route);
};

import { Top } from "@repo/admin-feature-top";

import { handleSignOut } from "@/app/actions";
import { getSession } from "@/server/better-auth/server";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await getSession();
  const name = session?.user?.name ?? session?.user?.email;
  const posts = await api.github.list();

  return (
    <HydrateClient>
      <Top name={name} onSignOut={handleSignOut} posts={posts} />
    </HydrateClient>
  );
}

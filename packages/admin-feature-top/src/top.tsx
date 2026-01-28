"use client";

import { useTranslations } from "next-intl";

type Props = {
  name?: null | string;
  onSignOut: () => Promise<void>;
  posts: string[];
};

export const Top = ({ name, onSignOut, posts }: Props) => {
  const t = useTranslations("admin.home");
  const displayName = name ? name : t("unknownUser");
  const signedInAs = t("signedInAs", { name: displayName });

  return (
    <main>
      <section>
        <header>
          <h1>{t("title")}</h1>
          <p>{signedInAs}</p>
        </header>
        <form>
          <button formAction={onSignOut}>{t("signOut")}</button>
        </form>
        <section>
          <h2>{t("postsTitle")}</h2>
          <ul>
            {posts.map((post) => (
              <li key={post}>{post}</li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
};

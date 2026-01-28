"use client";

import { useTranslations } from "next-intl";

type Props = {
  onSignIn?: (formData: FormData) => Promise<void> | void;
  onSignOut?: (formData: FormData) => Promise<void> | void;
  status?: Status;
};

type Status = "default" | "forbidden" | "missingAllowList";

export const SignIn = ({ onSignIn, onSignOut, status = "default" }: Props) => {
  const t = useTranslations("admin.signIn");
  const errorMessage =
    status === "forbidden"
      ? t("errorForbidden")
      : status === "missingAllowList"
        ? t("errorMissingAllowList")
        : null;

  return (
    <main>
      <section>
        <header>
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </header>
        {errorMessage && <p role="alert">{errorMessage}</p>}
        <form action={onSignIn}>
          <button type="submit">{t("action")}</button>
        </form>
        <p>{t("support")}</p>
        {onSignOut && (
          <form action={onSignOut}>
            <button type="submit">{t("signOut")}</button>
          </form>
        )}
      </section>
    </main>
  );
};

"use client";

import { useTranslations } from "next-intl";

type Props = {
  onSignIn?: (formData: FormData) => Promise<void> | void;
  onSignOut?: (formData: FormData) => Promise<void> | void;
};

export const SignIn = ({ onSignIn, onSignOut }: Props) => {
  const t = useTranslations("admin.signIn");

  return (
    <>
      <form action={onSignIn}>
        <button type="submit">{t("action")}</button>
      </form>
      {onSignOut && (
        <form action={onSignOut}>
          <button type="submit">{t("signOut")}</button>
        </form>
      )}
    </>
  );
};

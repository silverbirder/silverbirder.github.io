import { component$ } from "@builder.io/qwik";
import { useTranslate } from "qwik-speak";

export const BiographySection = component$(() => {
  const t = useTranslate();
  return (
    <section>
      <h2>{t("top.biography")}</h2>
      <div>{t("top.biographyMessage")}</div>
    </section>
  );
});

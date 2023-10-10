import { component$ } from "@builder.io/qwik";
import { useTranslate } from "qwik-speak";

export const BiographySection = component$(() => {
  const t = useTranslate();
  return (
    <section>
      <h3>{t("top.biography")}</h3>
      <div>{t("top.biographyMessage")}</div>
    </section>
  );
});

import { type RequestHandler } from "@builder.io/qwik-city";
import { config } from "../speak-config";

export const onRequest: RequestHandler = ({ pathname, locale }) => {
  const [, lang] = pathname.split("/");
  const supportedLang = config.supportedLocales.find(
    (value) => value.lang === lang
  );
  if (supportedLang !== undefined) {
    locale(supportedLang.lang);
    return;
  } else {
    locale(config.defaultLocale.lang);
  }
};

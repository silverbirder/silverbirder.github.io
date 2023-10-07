import { type RequestHandler } from "@builder.io/qwik-city";
import { config } from "../speak-config";
import { error } from "console";

export const onRequest: RequestHandler = ({ params, locale }) => {
  // Check supported locales
  const supportedLocale = config.supportedLocales.find(
    (value) => value.lang === params.lang
  );

  // Check for 404 error page
  const lang = supportedLocale
    ? supportedLocale.lang
    : !params.lang && config.defaultLocale.lang;

  if (!lang) throw error(404, "Page not found");

  // Set Qwik locale
  locale(lang);
};

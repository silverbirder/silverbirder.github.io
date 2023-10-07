import { component$, $ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { SpeakLocale } from "qwik-speak";
import { useSpeakConfig } from "qwik-speak";

export const ChangeLocale = component$(() => {
  const loc = useLocation();
  const config = useSpeakConfig();

  // Replace the locale and navigate to the new URL
  const navigateByLocale$ = $((newLocale: SpeakLocale) => {
    const url = new URL(location.href);
    if (loc.params.lang) {
      if (newLocale.lang !== config.defaultLocale.lang) {
        url.pathname = url.pathname.replace(loc.params.lang, newLocale.lang);
      } else {
        url.pathname = url.pathname.replace(
          new RegExp(`(/${loc.params.lang}/)|(/${loc.params.lang}$)`),
          "/"
        );
      }
    } else if (newLocale.lang !== config.defaultLocale.lang) {
      url.pathname = `/${newLocale.lang}${url.pathname}`;
    }

    location.href = url.toString();
  });

  return (
    <div>
      {config.supportedLocales.map((value) => (
        <button
          key={value.lang}
          onClick$={async () => await navigateByLocale$(value)}
        >
          {value.lang}
        </button>
      ))}
    </div>
  );
});

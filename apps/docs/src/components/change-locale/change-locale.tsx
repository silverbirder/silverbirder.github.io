import { component$, $ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { SpeakLocale } from "qwik-speak";
import { useSpeakConfig } from "qwik-speak";
import { UilLetterEnglishA, UilLetterJapaneseA } from "../icon/icon";
import { css } from "~/styled-system/css";

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
    <div
      class={css({
        display: "flex",
        flexDirection: "row",
        borderColor: "text.link",
        borderWidth: "1px",
      })}
    >
      <UilLetterJapaneseA
        class={css({
          width: "icon.mini",
          height: "icon.mini",
          cursor: "pointer",
          color: "text.link",
          borderRightColor: "text.link",
          borderRightWidth: "1px",
          _hover: {
            color: "text.linkActive",
          },
        })}
        onClick$={async () =>
          await navigateByLocale$(config.supportedLocales[0])
        }
      />
      <UilLetterEnglishA
        class={css({
          width: "icon.mini",
          height: "icon.mini",
          cursor: "pointer",
          color: "text.link",
          _hover: {
            color: "text.linkActive",
          },
        })}
        onClick$={async () =>
          await navigateByLocale$(config.supportedLocales[1])
        }
      />
    </div>
  );
});

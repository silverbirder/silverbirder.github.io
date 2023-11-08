import { component$, $ } from "@builder.io/qwik";
import type { SpeakLocale } from "qwik-speak";
import { useSpeakConfig, useSpeakLocale } from "qwik-speak";
import { UilLetterEnglishA, UilLetterJapaneseA } from "../icon/icon";
import { css } from "~/styled-system/css";

export const ChangeLocale = component$(() => {
  const sl = useSpeakLocale();
  const config = useSpeakConfig();

  const navigateByLocale$ = $((newLocale: SpeakLocale) => {
    const url = new URL(location.href);
    const [, , ...pathnameRest] = url.pathname.split("/");
    if (newLocale.lang === config.defaultLocale.lang) {
      url.pathname = pathnameRest.join("/");
    } else {
      url.pathname = `/${newLocale.lang}${url.pathname}`;
    }
    location.href = url.toString();
  });

  const ja = config.supportedLocales[0];
  const en = config.supportedLocales[1];

  return (
    <div
      class={css({
        display: "flex",
        flexDirection: "row",
        borderColor: "text.link",
        borderWidth: "1px",
      })}
    >
      {sl.lang === ja.lang ? (
        <UilLetterJapaneseA
          class={css({
            width: "icon.mini",
            height: "icon.mini",
            borderRightColor: "text.link",
            borderRightWidth: "1px",
            color: "white",
            backgroundColor: "text.link",
          })}
          data-testid="ja"
        />
      ) : (
        <UilLetterJapaneseA
          class={css({
            cursor: "pointer",
            width: "icon.mini",
            height: "icon.mini",
            borderRightColor: "text.link",
            borderRightWidth: "1px",
            color: "text.link",
            _hover: {
              color: "white",
              backgroundColor: "text.link",
            },
          })}
          onClick$={async () => await navigateByLocale$(ja)}
          data-testid="ja"
        />
      )}
      {sl.lang === en.lang ? (
        <UilLetterEnglishA
          class={css({
            width: "icon.mini",
            height: "icon.mini",
            color: "white",
            backgroundColor: "text.link",
          })}
          data-testid="en"
        />
      ) : (
        <UilLetterEnglishA
          class={css({
            cursor: "pointer",
            width: "icon.mini",
            height: "icon.mini",
            borderRightColor: "text.link",
            borderRightWidth: "1px",
            color: "text.link",
            _hover: {
              color: "white",
              backgroundColor: "text.link",
            },
          })}
          onClick$={async () => await navigateByLocale$(en)}
          data-testid="en"
        />
      )}
    </div>
  );
});

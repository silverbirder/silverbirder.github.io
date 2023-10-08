import { Slot, component$ } from "@builder.io/qwik";
import { Link as QwikLink, type LinkProps } from "@builder.io/qwik-city";
import { useSpeakConfig, useSpeakLocale } from "qwik-speak";

export const useLinkHref = (href: string): string => {
  const sl = useSpeakLocale();
  const config = useSpeakConfig();
  return sl.lang === config.defaultLocale.lang
    ? href
    : `/${sl.lang}/${href.replace(/^\//, "")}`;
};

export const Link = component$<LinkProps>((props) => {
  const { href, ...rest } = props;
  const hrefWithLocale = useLinkHref(href || "/");

  return (
    <QwikLink href={hrefWithLocale} {...rest}>
      <Slot />
    </QwikLink>
  );
});

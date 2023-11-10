import { component$, Slot } from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";
import { hstack } from "~/styled-system/patterns";
import ImgFavicon from "~/media/favicon.svg?jsx";
import { MdiGithub, MdiRss, MdiTwitter } from "~/components/icon/icon";
import { ChangeLocale } from "~/components/change-locale/change-locale";
import { useTranslate } from "qwik-speak";
import { Link } from "~/components/link/link";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  const t = useTranslate();
  return (
    <div
      class={css({
        display: "grid",
        gridTemplateAreas: `
        "header"
        "content"
        "footer"`,
        gridTemplateRows: "auto 1fr auto",
        gridTemplateColumns: "1fr",
      })}
    >
      <header
        class={[
          css({
            gridArea: "header",
            position: "sticky",
            backgroundColor: "bg.quote",
            height: "header.main",
            top: 0,
            zIndex: 2,
            backdropFilter: "blur(23px) saturate(4.5)",
          }),
          hstack({
            justifyContent: "space-between",
          }),
        ]}
      >
        <div>
          <Link href="/" aria-label="favicon">
            <ImgFavicon
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </Link>
        </div>
        <div class={hstack({ gap: 5 })}>
          <nav>
            <Link href="/blog">{t("app.blog@@ブログ")}</Link>
          </nav>
          <ChangeLocale />
          <nav class={hstack({ gap: 1 })}>
            <a
              href="https://github.com/silverbirder"
              target="_brank"
              aria-label="github"
            >
              <MdiGithub
                class={css({ width: "icon.main", height: "icon.main" })}
              />
            </a>
            <a
              href="https://x.com/silverbirder"
              target="_brank"
              aria-label="twitter"
            >
              <MdiTwitter
                class={css({ width: "icon.main", height: "icon.main" })}
              />
            </a>
            <Link href="/feed.xml" target="_blank">
              <MdiRss
                class={css({ width: "icon.main", height: "icon.main" })}
              ></MdiRss>
            </Link>
          </nav>
        </div>
      </header>
      <main
        class={css({
          gridArea: "content",
          width: {
            base: "95vw",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
          },
          margin: "1% auto",
        })}
      >
        <Slot />
      </main>
      <footer
        class={css({
          gridArea: "footer",
          backgroundColor: "bg.quote",
          display: "flex",
          placeContent: "center",
        })}
      >
        <p>&copy; 2023 silverbirder's portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
});

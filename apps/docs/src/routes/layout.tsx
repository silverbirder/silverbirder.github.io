import { component$, Slot } from "@builder.io/qwik";
import { Link, type RequestHandler } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";
import { hstack } from "~/styled-system/patterns";
import ImgFavicon from "~/media/favicon.svg?jsx";
import { MdiAmazon, MdiGithub, MdiTwitter } from "~/components/icon/icon";

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
            zIndex: 1,
            backdropFilter: "blur(23px) saturate(4.5)",
          }),
          hstack({
            justifyContent: "space-between",
          }),
        ]}
      >
        <h1>
          <Link href="/">
            <ImgFavicon
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </Link>
        </h1>
        <div class={hstack({ gap: 10 })}>
          <nav class={hstack({ gap: 1 })}>
            <Link href="/blog">Blog</Link>
            <Link href="/resume">Resume</Link>
            <Link href="/misc">Misc</Link>
          </nav>
          <nav class={hstack({ gap: 1 })}>
            <a href="https://github.com/silverbirder" target="_brank">
              <MdiGithub
                class={css({ width: "icon.main", height: "icon.main" })}
              />
            </a>
            <a href="https://x.com/silverbirder" target="_brank">
              <MdiTwitter
                class={css({ width: "icon.main", height: "icon.main" })}
              />
            </a>
            <a
              href="https://www.amazon.co.jp/gp/product/B08CY2QCFV/"
              target="_brank"
            >
              <MdiAmazon
                class={css({ width: "icon.main", height: "icon.main" })}
              ></MdiAmazon>
            </a>
          </nav>
        </div>
      </header>
      <main
        class={css({
          gridArea: "content",
          margin: {
            base: "0 5%",
            lg: "0 25%",
          },
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

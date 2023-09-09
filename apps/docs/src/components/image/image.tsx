import { component$ } from "@builder.io/qwik";
import { Image as UnpicImage } from "@unpic/qwik";
import { css } from "~/styled-system/css";

export interface ImageProps {
  src: string;
  width: number;
  height: number;
  layout: "constrained";
  alt: string;
  href: string;
}

export const Image = component$<ImageProps>((props) => {
  const { href, ...imageProps } = props;
  const isLink = !!href;

  return (
    <a href={isLink ? href : props.src} target="_blank">
      <figure
        title={props.alt}
        class={css({
          textAlign: "center",
        })}
      >
        <UnpicImage {...imageProps} />
        <figcaption
          class={css({
            fontSize: "0.8rem",
            color: "gray.500",
          })}
        >
          {props.alt}
        </figcaption>
      </figure>
    </a>
  );
});

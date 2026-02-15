"use client";

import type { ComponentPropsWithoutRef } from "react";

import { chakra } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

import { CellophaneTape } from "./cellophane-tape";
import { Link as DomainLink } from "./link";

type Props = ComponentPropsWithoutRef<"img"> & {
  linkHref?: string;
};

const NOTEBOOK_IMAGE_MAX_LINES = 20;
const NOTEBOOK_IMAGE_MAX_HEIGHT = `calc(var(--notebook-line-height) * ${NOTEBOOK_IMAGE_MAX_LINES})`;

export const NotebookImage = ({ alt, linkHref, onLoad, ...props }: Props) => {
  const t = useTranslations("ui.notebookImage");
  const wrapperRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const altText = alt;
  const hasCaption = Boolean(altText) || Boolean(linkHref);
  const className = props.className ?? "";
  const hasRemarkLinkCard = /remark-link-card/.test(className);
  const shouldShowTape = !hasRemarkLinkCard;

  const alignToGrid = useCallback(() => {
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!wrapper || !img) return;

    const lineHeight = Number.parseFloat(getComputedStyle(wrapper).lineHeight);
    if (!Number.isFinite(lineHeight) || lineHeight <= 0) return;

    const height = img.getBoundingClientRect().height;
    const remainder = height % lineHeight;
    const extra = remainder === 0 ? 0 : lineHeight - remainder;
    wrapper.style.paddingBottom = `${extra}px`;
  }, []);

  const handleLoad: Props["onLoad"] = (event) => {
    onLoad?.(event);
    alignToGrid();
  };

  const setImgRef = useCallback(
    (node: HTMLImageElement | null) => {
      imgRef.current = node;
      if (node?.complete) {
        requestAnimationFrame(alignToGrid);
      }
    },
    [alignToGrid],
  );

  return (
    <chakra.figure
      display="block"
      lineHeight="var(--notebook-line-height)"
      marginInline="auto"
      marginX={0}
      marginY="var(--notebook-line-height)"
      position="relative"
      ref={wrapperRef}
      width="fit-content"
    >
      {shouldShowTape && (
        <>
          <CellophaneTape
            height="calc(var(--notebook-line-height) * 0.75)"
            left="calc(var(--notebook-line-height) * -0.55)"
            pointerEvents="none"
            position="absolute"
            top="calc(var(--notebook-line-height) * -0.45)"
            transform="rotate(-14deg)"
            width="calc(var(--notebook-line-height) * 2.2)"
            zIndex={1}
          />
          <CellophaneTape
            height="calc(var(--notebook-line-height) * 0.75)"
            pointerEvents="none"
            position="absolute"
            right="calc(var(--notebook-line-height) * -0.55)"
            top="calc(var(--notebook-line-height) * -0.45)"
            transform="rotate(14deg) scaleX(-1)"
            width="calc(var(--notebook-line-height) * 2.2)"
            zIndex={1}
          />
        </>
      )}
      <chakra.img
        alt={alt ?? ""}
        bg="bg.muted"
        borderRadius="0"
        boxShadow="none"
        decoding={props.decoding ?? "async"}
        display="block"
        height="auto"
        loading={props.loading ?? "lazy"}
        marginX="auto"
        marginY="0"
        maxHeight={NOTEBOOK_IMAGE_MAX_HEIGHT}
        maxWidth="100%"
        onLoad={handleLoad}
        position="relative"
        ref={setImgRef}
        width="auto"
        {...props}
      />

      {hasCaption && (
        <chakra.figcaption
          color="fg.muted"
          display="block"
          fontSize="sm"
          lineHeight="var(--notebook-line-height)"
          margin={0}
          maxWidth="100%"
          textAlign="center"
        >
          <chakra.span
            overflowWrap="anywhere"
            whiteSpace="normal"
            wordBreak="break-word"
          >
            {linkHref ? (
              <DomainLink
                aria-label={t("openInNewTabAriaLabel")}
                href={linkHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                {altText && <chakra.span>{altText}</chakra.span>}
              </DomainLink>
            ) : (
              altText && altText
            )}
          </chakra.span>
        </chakra.figcaption>
      )}
    </chakra.figure>
  );
};

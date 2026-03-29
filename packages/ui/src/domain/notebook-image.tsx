"use client";

import type { ComponentPropsWithoutRef } from "react";

import {
  chakra,
  CloseButton,
  Dialog,
  Portal,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";

import { CellophaneTape } from "./cellophane-tape";
import { Link as DomainLink } from "./link";

type FrameBreakpoint = {
  height: string;
  width: string;
};

type Props = ComponentPropsWithoutRef<"img"> & {
  linkHref?: string;
};

type ResponsiveValue<T> = {
  base: T;
  lg: T;
  md: T;
  sm: T;
};

const NOTEBOOK_IMAGE_MAX_LINES = 20;
const NOTEBOOK_IMAGE_MAX_HEIGHT = `calc(var(--notebook-line-height) * ${NOTEBOOK_IMAGE_MAX_LINES})`;
const NOTEBOOK_LINE_HEIGHT_PX = 32;
const NOTEBOOK_IMAGE_WIDTH_STEPS = [280, 380, 480, 720] as const;
const NOTEBOOK_IMAGE_SIZES =
  "(min-width: 62rem) 720px, (min-width: 48rem) 480px, (min-width: 30rem) 380px, 280px";
const NOTEBOOK_IMAGE_MAX_HEIGHT_PX =
  NOTEBOOK_LINE_HEIGHT_PX * NOTEBOOK_IMAGE_MAX_LINES;
const DEFAULT_FRAME_WIDTH = {
  base: "280px",
  lg: "720px",
  md: "480px",
  sm: "380px",
} satisfies ResponsiveValue<string>;

const alignToNotebookGrid = (height: number) =>
  Math.ceil(height / NOTEBOOK_LINE_HEIGHT_PX) * NOTEBOOK_LINE_HEIGHT_PX;

const formatPixels = (value: number) => `${value.toFixed(3)}px`;

const calculateNotebookImageFrame = ({
  originalHeight,
  originalWidth,
  targetWidth,
}: {
  originalHeight: number;
  originalWidth: number;
  targetWidth: number;
}) => {
  const scaledHeight = (originalHeight / originalWidth) * targetWidth;

  if (scaledHeight <= NOTEBOOK_IMAGE_MAX_HEIGHT_PX) {
    return {
      height: scaledHeight,
      width: targetWidth,
    };
  }

  return {
    height: NOTEBOOK_IMAGE_MAX_HEIGHT_PX,
    width: (NOTEBOOK_IMAGE_MAX_HEIGHT_PX * originalWidth) / originalHeight,
  };
};

const extractCloudinaryAspectRatio = (src: string) => {
  try {
    const url = new URL(src);
    const aspectRatio = url.searchParams.get("ar");

    if (aspectRatio) {
      const [widthText, heightText] = aspectRatio.split(":");
      const width = Number.parseInt(widthText ?? "", 10);
      const height = Number.parseInt(heightText ?? "", 10);

      if (
        Number.isFinite(width) &&
        Number.isFinite(height) &&
        width > 0 &&
        height > 0
      ) {
        return {
          originalHeight: height,
          originalWidth: width,
        };
      }
    }
  } catch {
    // Fall through to path-based metadata parsing.
  }

  const match = src.match(/(?:^|\/|,)ar_(\d+):(\d+)(?:,|\/|$)/);
  if (!match?.[1] || !match[2]) {
    return null;
  }

  const width = Number.parseInt(match[1], 10);
  const height = Number.parseInt(match[2], 10);

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }

  return {
    originalHeight: height,
    originalWidth: width,
  };
};

const buildResponsiveFrame = ({
  originalHeight,
  originalWidth,
}: {
  originalHeight: number;
  originalWidth: number;
}) => {
  const [baseWidth, smWidth, mdWidth, lgWidth] = NOTEBOOK_IMAGE_WIDTH_STEPS;

  const createFrameBreakpoint = (targetWidth: number): FrameBreakpoint => {
    const frame = calculateNotebookImageFrame({
      originalHeight,
      originalWidth,
      targetWidth,
    });

    return {
      height: formatPixels(frame.height),
      width: formatPixels(frame.width),
    };
  };

  const base = createFrameBreakpoint(baseWidth);
  const sm = createFrameBreakpoint(smWidth);
  const md = createFrameBreakpoint(mdWidth);
  const lg = createFrameBreakpoint(lgWidth);

  return { base, lg, md, sm };
};

const buildResponsivePadding = (frame: ResponsiveValue<FrameBreakpoint>) => {
  const createPadding = ({ height }: FrameBreakpoint) => {
    const alignedHeight = alignToNotebookGrid(Number.parseFloat(height));
    return formatPixels(alignedHeight - Number.parseFloat(height));
  };

  return {
    base: createPadding(frame.base),
    lg: createPadding(frame.lg),
    md: createPadding(frame.md),
    sm: createPadding(frame.sm),
  } satisfies ResponsiveValue<string>;
};

type ImageFrameProps = {
  alt: string;
  cloudinaryAspectRatio: null | {
    originalHeight: number;
    originalWidth: number;
  };
  decoding: "async" | "auto" | "sync";
  frameHeight: "auto" | ResponsiveValue<string>;
  frameWidth: ResponsiveValue<string>;
  loading: "eager" | "lazy";
  shouldShowTape: boolean;
  src: string;
};

const NotebookImageFrame = ({
  alt,
  cloudinaryAspectRatio,
  decoding,
  frameHeight,
  frameWidth,
  loading,
  shouldShowTape,
  src,
}: ImageFrameProps) => {
  return (
    <chakra.div
      backgroundColor="border.muted"
      borderColor="border.muted"
      borderWidth="1px"
      boxSizing="border-box"
      height={frameHeight}
      marginX="auto"
      marginY="0"
      position="relative"
      width={frameWidth}
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
      <Image
        alt={alt}
        decoding={decoding}
        fill
        loading={loading}
        sizes={cloudinaryAspectRatio ? NOTEBOOK_IMAGE_SIZES : "100vw"}
        src={src}
        style={{
          borderRadius: 0,
          display: "block",
          height: "100%",
          maxHeight: NOTEBOOK_IMAGE_MAX_HEIGHT,
          objectFit: "contain",
          width: "100%",
        }}
      />
    </chakra.div>
  );
};

export const NotebookImage = ({ alt, linkHref, src, ...props }: Props) => {
  const t = useTranslations("ui.notebookImage");
  const srcString = typeof src === "string" ? src : undefined;
  const className = props.className ?? "";

  const hasCaption = Boolean(alt) || Boolean(linkHref);
  const hasRemarkLinkCard = /remark-link-card/.test(className);
  const shouldShowTape = !hasRemarkLinkCard;

  const cloudinaryAspectRatio = useMemo(
    () => (srcString ? extractCloudinaryAspectRatio(srcString) : null),
    [srcString],
  );

  const frame = useMemo(() => {
    if (!cloudinaryAspectRatio) {
      return null;
    }

    return buildResponsiveFrame(cloudinaryAspectRatio);
  }, [cloudinaryAspectRatio]);

  const paddingBottom = frame ? buildResponsivePadding(frame) : undefined;
  const frameWidth = frame
    ? {
        base: frame.base.width,
        lg: frame.lg.width,
        md: frame.md.width,
        sm: frame.sm.width,
      }
    : DEFAULT_FRAME_WIDTH;
  const frameHeight = frame
    ? {
        base: frame.base.height,
        lg: frame.lg.height,
        md: frame.md.height,
        sm: frame.sm.height,
      }
    : "auto";
  const imageDecoding = props.decoding ?? "async";
  const imageAlt = alt ?? "";
  const imageLoading = props.loading ?? "lazy";

  return (
    <chakra.figure
      className={`not-prose ${className}`.trim()}
      display="block"
      lineHeight="var(--notebook-line-height)"
      marginInline="auto"
      marginX="auto"
      marginY="var(--notebook-line-height)"
      paddingBottom={paddingBottom}
      width={frameWidth}
    >
      {srcString ? (
        <Dialog.Root
          lazyMount
          motionPreset="slide-in-bottom"
          placement="center"
        >
          <Dialog.Trigger asChild>
            <chakra.button
              _focusVisible={{
                outline: "2px solid",
                outlineColor: "green.focusRing",
                outlineOffset: "4px",
              }}
              aria-label={t("expandImageAriaLabel")}
              background="transparent"
              cursor="zoom-in"
              display="block"
              margin={0}
              padding={0}
              width={frameWidth}
            >
              <NotebookImageFrame
                alt={imageAlt}
                cloudinaryAspectRatio={cloudinaryAspectRatio}
                decoding={imageDecoding}
                frameHeight={frameHeight}
                frameWidth={frameWidth}
                loading={imageLoading}
                shouldShowTape={shouldShowTape}
                src={srcString}
              />
            </chakra.button>
          </Dialog.Trigger>

          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner padding="0">
              <Dialog.Content
                margin="0"
                maxHeight="100dvh"
                maxWidth="1200px"
                width="fit-content"
              >
                <Dialog.Header padding="0">
                  <VisuallyHidden>
                    <Dialog.Title>{t("expandedImageDialogTitle")}</Dialog.Title>
                  </VisuallyHidden>
                </Dialog.Header>
                <Dialog.Body padding="0">
                  <chakra.img
                    alt={imageAlt}
                    display="block"
                    marginX="auto"
                    maxHeight="100dvh"
                    maxWidth="100%"
                    objectFit="contain"
                    src={srcString}
                    width="auto"
                  />
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton aria-label={t("closeExpandedImageAriaLabel")} />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      ) : (
        <NotebookImageFrame
          alt={imageAlt}
          cloudinaryAspectRatio={cloudinaryAspectRatio}
          decoding={imageDecoding}
          frameHeight={frameHeight}
          frameWidth={frameWidth}
          loading={imageLoading}
          shouldShowTape={shouldShowTape}
          src=""
        />
      )}

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
                {alt && <chakra.span>{alt}</chakra.span>}
              </DomainLink>
            ) : (
              alt && alt
            )}
          </chakra.span>
        </chakra.figcaption>
      )}
    </chakra.figure>
  );
};

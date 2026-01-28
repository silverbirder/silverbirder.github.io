"use client";

import type { LinkProps } from "@chakra-ui/react";
import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
} from "react";

import { Link as ChakraLink } from "@chakra-ui/react";
import { Children, isValidElement } from "react";

import { Link as DomainLink } from "./link";
import { NotebookImage } from "./notebook-image";
import { TweetEmbed } from "./tweet-embed";
import { ViewTransitionLink } from "./view-transition-link";

const extractTweetId = (href?: string) => {
  if (!href) {
    return null;
  }
  try {
    const url = new URL(href);
    const hostname = url.hostname.replace(/^www\./, "");
    if (hostname !== "twitter.com" && hostname !== "x.com") {
      return null;
    }
    const match = url.pathname.match(/\/status\/(\d+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
};

const normalizeChildren = (children: ReactNode) => {
  return Children.toArray(children).filter((child) => {
    if (typeof child === "string") return child.length > 0;
    if (typeof child === "boolean") return false;
    return child != null;
  });
};

const getSingleElementChild = (children: ReactNode): null | ReactElement => {
  const normalized = normalizeChildren(children);
  if (normalized.length !== 1) return null;
  const child = normalized[0];
  return isValidElement(child) ? child : null;
};

const Anchor = ({ children, href, ...props }: LinkProps) => {
  const onlyChild = getSingleElementChild(children);

  if (href && onlyChild && onlyChild.type === NotebookImage) {
    const imageElement = onlyChild as ReactElement<
      ComponentProps<typeof NotebookImage>
    >;

    return <NotebookImage {...imageElement.props} linkHref={href} />;
  }

  const className = (props as { className?: string }).className ?? "";
  const isRemarkCard =
    /remark-link-card/.test(className) ||
    /remark-link-card-plus/.test(className);

  if (isRemarkCard) {
    return (
      <ChakraLink href={href} {...props}>
        {children}
      </ChakraLink>
    );
  }

  if (className.includes("mdx-heading-anchor")) {
    return (
      <ViewTransitionLink
        _hover={{ textDecoration: "none" }}
        color="inherit"
        href={href}
        textDecoration="none"
        {...props}
      >
        {children}
      </ViewTransitionLink>
    );
  }

  return (
    <DomainLink href={href} {...props}>
      {children}
    </DomainLink>
  );
};

const Paragraph = ({ children, ...props }: ComponentPropsWithoutRef<"p">) => {
  const onlyChild = getSingleElementChild(children);

  if (onlyChild && onlyChild.type === Anchor) {
    const tweetId = extractTweetId(
      (onlyChild.props as undefined | { href?: string })?.href,
    );
    if (tweetId) {
      return <TweetEmbed id={tweetId} />;
    }
  }

  if (
    onlyChild &&
    (onlyChild.type === NotebookImage || onlyChild.type === Anchor)
  ) {
    return <>{children}</>;
  }

  return <p {...props}>{children}</p>;
};

export const mdxComponents = {
  a: Anchor,
  img: NotebookImage,
  p: Paragraph,
};

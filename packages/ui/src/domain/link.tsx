"use client";

import type { LinkProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Link as ChakraLink, Icon } from "@chakra-ui/react";
import NextLink from "next/link";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

type Props = LinkProps & {
  children: ReactNode;
};

const isExternalHref = (href: string, origin: string) => {
  if (href.startsWith("#") || href.startsWith("/")) {
    return false;
  }

  try {
    const url = new URL(href, origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    return url.origin !== origin;
  } catch {
    return false;
  }
};

export const Link = ({ children, href, ...linkProps }: Props) => {
  const isExternal =
    href && typeof href === "string" && typeof window !== "undefined"
      ? isExternalHref(href, window.location.origin)
      : false;

  const resolvedRel =
    isExternal && !linkProps.rel ? "noopener noreferrer" : linkProps.rel;
  const resolvedTarget =
    isExternal && !linkProps.target ? "_blank" : linkProps.target;
  const resolvedAs =
    linkProps.as ?? (isExternal ? "a" : (NextLink as LinkProps["as"]));

  return (
    <ChakraLink
      color={"green.fg"}
      display="inline"
      href={href}
      rel={resolvedRel}
      target={resolvedTarget}
      {...linkProps}
      as={resolvedAs}
    >
      {children}
      {isExternal ? (
        <Icon aria-hidden as={FaArrowUpRightFromSquare} mx={0.5} pb={0.5} />
      ) : null}
    </ChakraLink>
  );
};

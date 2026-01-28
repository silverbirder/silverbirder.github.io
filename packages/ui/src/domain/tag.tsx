"use client";

import type { ComponentProps } from "react";

import { Box, chakra, Icon } from "@chakra-ui/react";
import { FaCalendarDays, FaPlus, FaTag, FaXmark } from "react-icons/fa6";

import { ViewTransitionLink } from "./view-transition-link";

type Props = Omit<ComponentProps<typeof ViewTransitionLink>, "children"> & {
  iconType?: "tag" | "year";
  isSelected?: boolean;
  tag: string;
};

const buildTagHref = (tag: string) => `/blog?tag=${encodeURIComponent(tag)}`;
const buildYearHref = (year: string) =>
  `/blog?year=${encodeURIComponent(year)}`;

export const Tag = ({
  href,
  iconType = "tag",
  isSelected = false,
  tag,
  ...linkProps
}: Props) => {
  const IconComponent = iconType === "year" ? FaCalendarDays : FaTag;
  const RightIcon = isSelected ? FaXmark : FaPlus;
  const resolvedHref =
    href ?? (iconType === "year" ? buildYearHref(tag) : buildTagHref(tag));

  return (
    <Box
      alignItems="center"
      display="inline-flex"
      height="var(--notebook-line-height)"
      justifyContent="center"
    >
      <ViewTransitionLink
        alignItems="center"
        aria-current={isSelected ? "page" : undefined}
        aria-label={iconType === "year" ? `Filter by year ${tag}` : undefined}
        bg={isSelected ? "green.fg" : "green.subtle"}
        borderRadius="full"
        color={isSelected ? "green.contrast" : "green.fg"}
        display="inline-flex"
        fontSize="xs"
        fontWeight={"600"}
        gap="1"
        height="calc(var(--notebook-line-height) * 0.75)"
        href={resolvedHref}
        justifyContent="center"
        lineHeight="1"
        px={2}
        textDecoration={"none"}
        {...linkProps}
      >
        <Box alignItems="center" display="inline-flex" gap="0.5">
          <Icon aria-hidden as={IconComponent} boxSize="1em" />
          <chakra.span>{tag}</chakra.span>
        </Box>
        <Icon aria-hidden as={RightIcon} boxSize="1em" />
      </ViewTransitionLink>
    </Box>
  );
};

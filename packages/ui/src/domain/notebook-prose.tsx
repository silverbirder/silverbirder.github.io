"use client";

import { chakra } from "@chakra-ui/react";

const TRAILING_PSEUDO_REGEX = /(::?[\w-]+(?:\([^)]*\))?)+$/;
const EXCLUDE_CLASSNAME = ".not-prose";
export const NOTEBOOK_LINE_HEIGHT = "2rem";
const NOTEBOOK_LINE_COLOR = "var(--chakra-colors-border-muted)";
function inWhere<T extends string>(
  selector: T,
  extraExclude?: string | string[],
): T {
  const rebuiltSelector = selector.startsWith("& ")
    ? selector.slice(2)
    : selector;
  const match = selector.match(TRAILING_PSEUDO_REGEX);
  const pseudo = match ? match[0] : "";
  const base = match ? selector.slice(0, -match[0].length) : rebuiltSelector;
  const extraExclusions = Array.isArray(extraExclude)
    ? extraExclude
    : extraExclude
      ? [extraExclude]
      : [];
  const extraExcludeSelectors = extraExclusions.flatMap((value) => [
    value,
    `${value} *`,
  ]);
  const excludeSelectors = [
    EXCLUDE_CLASSNAME,
    `${EXCLUDE_CLASSNAME} *`,
    ...extraExcludeSelectors,
  ].join(", ");
  return `& :where(${base}):not(${excludeSelectors})${pseudo}` as T;
}

export const NotebookProse = chakra("div", {
  base: {
    "& .oembed-card": {
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    "& .remark-link-card-plus__card": {
      backgroundColor: "bg",
      borderColor: "border.muted",
      borderRadius: "none",
      borderStyle: "solid",
      borderWidth: "1px",
      color: "inherit",
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      height: "calc(var(--notebook-line-height) * 4)",
      overflow: "hidden",
      textDecoration: "none",
    },
    "& .remark-link-card-plus__card:hover": {
      color: "inherit",
      textDecoration: "none",
    },
    "& .remark-link-card-plus__container": {
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    "& .remark-link-card-plus__content": {
      display: "flex",
      flexDirection: "column",
      gap: "0.15rem",
    },
    "& .remark-link-card-plus__description": {
      color: "fg.muted",
      fontSize: "sm",
      lineClamp: 1,
    },
    "& .remark-link-card-plus__favicon": {
      display: "block",
      height: "1rem !important",
      width: "1rem !important",
    },
    "& .remark-link-card-plus__image": {
      display: "block",
      height: "100% !important",
      objectFit: "cover",
      width: "100% !important",
    },
    "& .remark-link-card-plus__main": {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      minWidth: "0",
      padding: "calc(var(--notebook-line-height) / 2)",
    },
    "& .remark-link-card-plus__meta": {
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      fontSize: "xs",
      gap: "0.35rem",
      marginTop: "auto",
    },
    "& .remark-link-card-plus__meta figure": {
      lineHeight: "normal",
      margin: "0 !important",
      padding: "0 !important",
      paddingBottom: "0 !important",
    },
    "& .remark-link-card-plus__thumbnail": {
      display: "block",
      flexShrink: 0,
      height: "100%",
      maxWidth: "16rem",
      width: "33%",
    },
    "& .remark-link-card-plus__thumbnail figcaption": {
      display: "none",
    },
    "& .remark-link-card-plus__thumbnail figure": {
      height: "100%",
      lineHeight: "normal",
      margin: "0 !important",
      padding: "0 !important",
      paddingBottom: "0 !important",
    },
    "& .remark-link-card-plus__title": {
      color: "fg",
      fontWeight: "600",
      lineClamp: 1,
    },
    "& .remark-link-card-plus__url": {
      color: "inherit",
    },
    "--notebook-line-height": NOTEBOOK_LINE_HEIGHT,
    _dark: {
      [inWhere("& pre code span")]: {
        color: "var(--shiki-dark)",
      },
    },
    backgroundColor: "bg",
    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(--notebook-line-height) - 1px), ${NOTEBOOK_LINE_COLOR} calc(var(--notebook-line-height) - 1px), ${NOTEBOOK_LINE_COLOR} var(--notebook-line-height))`,
    backgroundPosition: "0 0",
    backgroundSize: "100% var(--notebook-line-height)",
    color: "fg.muted",
    fontSize: "sm",
    [inWhere("& .mdx-heading-anchor::after")]: {
      content: '"#"',
      opacity: 0,
      transition: "opacity 0.15s ease",
    },
    [inWhere("& :is(h1, h2, h3, h4, h5, h6):hover .mdx-heading-anchor::after")]:
      {
        opacity: 1,
      },
    [inWhere("& :is(h1,h2,h3,h4,h5,hr) + *")]: {
      marginTop: "0",
    },
    [inWhere("& > ol > li > p:first-of-type")]: {
      marginTop: "0em",
    },
    [inWhere("& > ol > li > p:last-of-type")]: {
      marginBottom: "0em",
    },
    [inWhere("& > ol > li p")]: {
      marginBottom: "0",
      marginTop: "0",
    },
    [inWhere("& > ul > li > p:first-of-type")]: {
      marginTop: "0em",
    },
    [inWhere("& > ul > li > p:last-of-type")]: {
      marginBottom: "0em",
    },
    [inWhere("& > ul > li p")]: {
      marginBottom: "0",
      marginTop: "0",
    },
    [inWhere("& a", [
      ".remark-link-card-plus__container",
      ".remark-link-card-plus__card",
    ])]: {
      color: "fg",
      fontWeight: "500",
      overflowWrap: "anywhere",
      textDecoration: "underline",
      textDecorationColor: "border.muted",
      textDecorationThickness: "2px",
      textUnderlineOffset: "3px",
    },
    [inWhere("& a strong")]: {
      color: "inherit",
    },
    [inWhere("& blockquote")]: {
      borderInlineStartWidth: "0.25em",
      color: "fg",
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
      paddingInline: "var(--notebook-line-height)",
    },
    [inWhere("& code")]: {
      bg: "bg.muted",
      borderRadius: "md",
      borderWidth: "0",
      fontFamily: "inherit",
      fontSize: "1em",
      letterSpacing: "-0.01em",
      lineHeight: "inherit",
      paddingBlock: "0",
      paddingInline: "0.25em",
    },
    [inWhere("& dd")]: {
      marginTop: "var(--notebook-line-height)",
      paddingInlineStart: "var(--notebook-line-height)",
    },
    [inWhere("& dl")]: {
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    [inWhere("& dt")]: {
      fontWeight: "600",
      marginTop: "var(--notebook-line-height)",
    },
    [inWhere("& em")]: {
      fontStyle: "italic",
    },
    [inWhere("& figcaption")]: {
      color: "fg.muted",
      fontSize: "0.85em",
      lineHeight: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    [inWhere("& figure")]: {
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    [inWhere("& figure > *")]: {
      marginBottom: "0",
      marginTop: "0",
    },
    [inWhere("& h1")]: {
      fontSize: "2.15em",
      letterSpacing: "-0.02em",
      lineHeight: "var(--notebook-line-height)",
      marginBottom: "var(--notebook-line-height)",
      marginTop: "0",
    },
    [inWhere("& h1, h2, h3, h4, h5, h6")]: {
      color: "fg",
      fontWeight: "600",
    },
    [inWhere("& h2")]: {
      fontSize: "1.65em",
      letterSpacing: "-0.02em",
      lineHeight: "var(--notebook-line-height)",
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    [inWhere("& h2 code")]: {
      fontSize: "0.9em",
    },
    [inWhere("& h3")]: {
      fontSize: "1.35em",
      letterSpacing: "-0.01em",
      lineHeight: "var(--notebook-line-height)",
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    [inWhere("& h3 code")]: {
      fontSize: "0.8em",
    },
    [inWhere("& h4")]: {
      letterSpacing: "-0.01em",
      lineHeight: "var(--notebook-line-height)",
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    [inWhere("& hr")]: {
      border: "0",
      height: "0",
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
      position: "relative",
    },
    [inWhere("& hr::after")]: {
      borderTopColor: "border.muted",
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      content: '""',
      insetInline: "0",
      position: "absolute",
      top: "0",
    },
    [inWhere("& img")]: {
      borderRadius: "lg",
      boxShadow: "inset",
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    [inWhere("& kbd")]: {
      "--shadow": "colors.border",
      borderRadius: "xs",
      boxShadow: "0 0 0 1px var(--shadow), 0 1px 0 1px var(--shadow)",
      color: "fg.muted",
      fontFamily: "inherit",
      fontSize: "1em",
      lineHeight: "inherit",
      paddingBlock: "0",
      paddingInlineEnd: "0.35em",
      paddingInlineStart: "0.35em",
    },
    [inWhere("& li")]: {
      lineHeight: "var(--notebook-line-height)",
      marginBottom: "0",
      marginTop: "0",
    },
    [inWhere("& ol")]: {
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
      paddingInlineStart: "var(--notebook-line-height)",
    },
    [inWhere("& ol > li")]: {
      "&::marker": {
        color: "fg.muted",
      },
      listStyleType: "decimal",
      paddingInlineStart: "0.4em",
    },
    [inWhere("& p")]: {
      lineHeight: "var(--notebook-line-height)",
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    [inWhere("& picture")]: {
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    [inWhere("& picture > img")]: {
      marginBottom: "0",
      marginTop: "0",
    },
    [inWhere("& pre")]: {
      backgroundColor: "bg.muted",
      fontFamily: "var(--chakra-fonts-mono)",
      fontSize: "0.9em",
      fontWeight: "400",
      lineHeight: "var(--notebook-line-height)",
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
      overflowX: "auto",
      paddingBottom: "var(--notebook-line-height)",
      paddingInlineEnd: "var(--notebook-line-height)",
      paddingInlineStart: "var(--notebook-line-height)",
      paddingTop: "var(--notebook-line-height)",
    },
    [inWhere("& pre [data-line]")]: {
      display: "block",
      minHeight: "1em",
      paddingInlineEnd: "calc(var(--notebook-line-height) / 2)",
    },
    [inWhere("& pre code")]: {
      bg: "transparent",
      borderWidth: "inherit",
      fontFamily: "inherit",
      fontSize: "inherit",
      letterSpacing: "inherit",
      lineHeight: "inherit",
      padding: "0",
    },
    [inWhere("& pre code span")]: {
      color: "var(--shiki-light)",
    },
    [inWhere("& strong")]: {
      backgroundImage:
        "linear-gradient(transparent 80%, var(--chakra-colors-green-solid) 20%)",
      fontWeight: "600",
    },
    [inWhere("& table")]: {
      backgroundColor: "bg.muted",
      backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(--notebook-line-height) - 1px), ${NOTEBOOK_LINE_COLOR} calc(var(--notebook-line-height) - 1px), ${NOTEBOOK_LINE_COLOR} var(--notebook-line-height))`,
      backgroundPosition: "0 0",
      backgroundSize: "100% var(--notebook-line-height)",
      borderCollapse: "separate",
      borderSpacing: "0",
      lineHeight: "var(--notebook-line-height)",
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
      tableLayout: "auto",
      textAlign: "start",
      width: "100%",
    },
    [inWhere("& tbody td, tfoot td")]: {
      paddingBlock: "calc(var(--notebook-line-height) / 2)",
      paddingInlineEnd: "1em",
      paddingInlineStart: "1em",
    },
    [inWhere("& tbody td:first-of-type, tfoot td:first-of-type")]: {
      paddingInlineStart: "calc(var(--notebook-line-height) / 2)",
    },
    [inWhere("& tbody td:last-of-type, tfoot td:last-of-type")]: {
      paddingInlineEnd: "calc(var(--notebook-line-height) / 2)",
    },
    [inWhere("& tbody tr")]: {
      boxShadow: "inset 0 -1px var(--chakra-colors-border)",
    },
    [inWhere("& thead")]: {
      color: "fg",
    },
    [inWhere("& thead th")]: {
      boxShadow: "inset 0 -1px var(--chakra-colors-border)",
      fontWeight: "medium",
      height: "var(--notebook-line-height)",
      paddingBlock: "0",
      paddingInlineEnd: "1em",
      paddingInlineStart: "1em",
      textAlign: "start",
    },
    [inWhere("& thead th:first-of-type")]: {
      paddingInlineStart: "calc(var(--notebook-line-height) / 2)",
    },
    [inWhere("& thead th:last-of-type")]: {
      paddingInlineEnd: "calc(var(--notebook-line-height) / 2)",
    },
    [inWhere("& ul")]: {
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
      paddingInlineStart: "var(--notebook-line-height)",
    },
    [inWhere("& ul > li")]: {
      "&::marker": {
        color: "fg.muted",
      },
      listStyleType: "disc",
      paddingInlineStart: "0.4em",
    },
    [inWhere("& ul ul, ul ol, ol ul, ol ol")]: {
      marginBottom: "0",
      marginTop: "0",
    },
    [inWhere("& video")]: {
      marginBottom: "var(--notebook-line-height)",
      marginTop: "var(--notebook-line-height)",
    },
    lineHeight: "var(--notebook-line-height)",
    paddingInline: "var(--notebook-line-height)",
    position: "relative",
  },
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      lg: {
        fontSize: "md",
      },
      md: {
        fontSize: "sm",
      },
    },
  },
});

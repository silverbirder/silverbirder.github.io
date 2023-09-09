import { defineGlobalStyles } from "@pandacss/dev";

export const globalCss = defineGlobalStyles({
  "*": {
    boxSizing: "border-box",
  },
  "html, body": {
    margin: 0,
    padding: 0,
    // fontFamily: "noto",
    fontSize: "base",
    lineHeight: 1.5,
    color: "text.main",
    backgroundColor: "bg.main",
    height: "100%",
  },
  "h1, h2, h3, h4, h5, h6": {
    margin: 0,
    fontWeight: "normal",
  },
  h1: {
    fontSize: "5xl",
  },
  h2: {
    fontSize: "4xl",
  },
  h3: {
    fontSize: "3xl",
  },
  h4: {
    fontSize: "2xl",
  },
  h5: {
    fontSize: "xl",
  },
  h6: {
    fontSize: "lg",
  },
  "h1, h2, h3, h4, h5, h6, p, ul, ol, dl, table, blockquote, pre, form, fieldset, iframe, hr":
    {
      margin: "1rem 0",
    },
  "ul, ol, dl": {
    listStyle: "inside",
    paddingLeft: "1.5rem",
  },
  "ol ol, ul ol": {
    listStyle: "lower-latin",
  },
  "ul ul, ul ol, ol ul, ol ol": {
    margin: 0,
  },
  blockquote: {
    margin: "1rem 0",
    padding: "0 1rem",
    borderLeftColor: "bg.quote",
    borderLeftWidth: "thin",
    backgroundColor: "bg.quote",
  },
  "blockquote:before, blockquote:after, q:before, q:after": {
    content: "none",
  },
  code: {
    overflow: "auto",
  },
  a: {
    color: "text.link",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      color: "text.linkActive",
    },
    "&:active": {
      textDecoration: "underline",
      color: "text.linkActive",
    },
    "&:focus": {
      outline: "none",
    },
  },
  img: {
    margin: "auto",
  },
  table: {
    borderCollapse: "collapse",
    borderSpacing: 0,
    border: "1px solid",
    "& thead": {
      verticalAlign: "bottom",
      borderBottom: "2px solid",
    },
    "& tbody": {
      verticalAlign: "top",
    },
    "& tr": {
      verticalAlign: "top",
      borderBottom: "1px solid",
    },
    "& th": {
      fontWeight: "bold",
    },
    "& td": {
      fontWeight: "normal",
    },
    "& caption": {
      textAlign: "left",
      fontWeight: "bold",
    },
  },
  "address, caption, cite, code, dfn, em, strong, var": {
    fontStyle: "normal",
    fontWeight: "normal",
  },
  "input, textarea, select, button": {
    margin: 0,
    padding: 0,
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    color: "inherit",
    "&:not(button)": {
      verticalAlign: "middle",
    },
    "&:is(button)": {
      cursor: "pointer",
    },
  },
});

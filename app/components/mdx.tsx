import { Link } from "next-view-transitions";
import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";
import remarkGfm from "remark-gfm";
import { EnhancedImage } from "./enhanced-image";
import { EnhancedCode } from "./enhanced-code";

function Table({ children }) {
  return <table className="my-6">{children}</table>;
}

function CustomLink(props) {
  const href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props} className="text-accent hover:underline">
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} className="text-accent hover:underline" />;
  }

  return (
    <a
      className="text-accent hover:underline text-base"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function createHeading(level) {
  const Heading = ({ children }) => {
    const slug = slugify(children);
    const className =
      level <= 2
        ? "text-xl leading-[3rem] font-bold mt-6 border-b-2 -mb-[2px] border-primary border-dashed"
        : "text-lg leading-[3rem] font-bold mt-6 border-b -mb-[1px] border-primary border-dashed";
    return React.createElement(`h${level}`, { id: slug, className }, children);
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

function Paragraph({ children }) {
  return <p className="text-foreground text-base my-6">{children}</p>;
}

function OrderedList({ children }) {
  return <ol className="text-foreground text-base my-6">{children}</ol>;
}

function UnorderedList({ children }) {
  return <ul className="text-foreground text-base my-6">{children}</ul>;
}

function ListItem({ children }) {
  return <li className="text-foreground text-base my-0">{children}</li>;
}

function Pre({ children }) {
  return <pre className="my-6 py-6 text-xs leading-6">{children}</pre>;
}

function BlockQuote({ children }) {
  return (
    <blockquote className="my-6 text-muted-foreground">{children}</blockquote>
  );
}

function HorizontalRule() {
  return (
    <hr className="h-6 mt-6 mb-0 border-dotted border-t-6 border-border" />
  );
}

function Image(props) {
  return <EnhancedImage {...props} className={"h-48 md:h-60 lg:h-96"} />;
}

function Code(props) {
  return <EnhancedCode {...props} />;
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: Image,
  a: CustomLink,
  pre: Pre,
  table: Table,
  p: Paragraph,
  ol: OrderedList,
  ul: UnorderedList,
  li: ListItem,
  code: Code,
  blockquote: BlockQuote,
  hr: HorizontalRule,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}

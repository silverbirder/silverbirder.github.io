"use client";

import { MDXClient } from "next-mdx-remote-client";

import { mdxComponents } from "./mdx-components";

type Props = {
  compiledSource: string;
};

export const MdxClientWrapper = ({ compiledSource }: Props) => {
  return (
    <MDXClient compiledSource={compiledSource} components={mdxComponents} />
  );
};

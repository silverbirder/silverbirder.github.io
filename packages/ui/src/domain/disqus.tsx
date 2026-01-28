"use client";

import { Box } from "@chakra-ui/react";
import { DiscussionEmbed } from "disqus-react";

import { NOTEBOOK_LINE_HEIGHT } from "./notebook-prose";

type Props = {
  shortname: string;
  url: string;
};

export const Disqus = ({ shortname, url }: Props) => {
  return (
    <Box as="section" bg="border.muted" p={`calc(${NOTEBOOK_LINE_HEIGHT} / 2)`}>
      <DiscussionEmbed
        config={{
          url,
        }}
        shortname={shortname}
      />
    </Box>
  );
};

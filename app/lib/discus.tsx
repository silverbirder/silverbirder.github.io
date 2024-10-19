"use client";

import { DiscussionEmbed } from "disqus-react";

const Discus = ({ url }) => {
  return (
    <DiscussionEmbed
      shortname="https-silverbirder-github-io"
      config={{
        url,
      }}
    />
  );
};

export default Discus;

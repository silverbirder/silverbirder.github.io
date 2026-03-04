import type { ReactNode } from "react";

import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";

export type FollowItem = {
  borderColor: string;
  hoverTextColor: string;
  href: string;
  icon: ReactNode;
  iconColor: string;
  label: string;
};

export type FollowLinks = {
  bluesky: string;
  github: string;
  rss: string;
  x: string;
};

export type FollowSection = {
  heading: string;
  items: FollowItem[];
};

type CreateFollowSectionArgs = {
  labels: FollowLabels;
  links: FollowLinks;
};

type FollowLabels = {
  bluesky: string;
  github: string;
  heading: string;
  x: string;
};

export const createFollowSection = ({
  labels,
  links,
}: CreateFollowSectionArgs): FollowSection => {
  const items: FollowItem[] = [
    {
      borderColor: "fg",
      hoverTextColor: "bg",
      href: links.x,
      icon: <FaXTwitter />,
      iconColor: "fg",
      label: labels.x,
    },
    {
      borderColor: "#007bff",
      hoverTextColor: "white",
      href: links.bluesky,
      icon: <SiBluesky />,
      iconColor: "#007bff",
      label: labels.bluesky,
    },
    {
      borderColor: "fg",
      hoverTextColor: "bg",
      href: links.github,
      icon: <FaGithub />,
      iconColor: "fg",
      label: labels.github,
    },
  ];
  return {
    heading: labels.heading,
    items,
  };
};

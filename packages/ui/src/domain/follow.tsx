import type { ReactNode } from "react";

import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { SiBluesky, SiThreads } from "react-icons/si";

export type FollowItem = {
  active: string;
  bg: string;
  hover: string;
  href: string;
  icon: ReactNode;
  label: string;
};

export type FollowLinks = {
  bluesky: string;
  github: string;
  rss: string;
  threads: string;
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
  threads: string;
  x: string;
};

export const createFollowSection = ({
  labels,
  links,
}: CreateFollowSectionArgs): FollowSection => {
  const items: FollowItem[] = [
    {
      active: "#1f1f1f",
      bg: "#000000",
      hover: "#111111",
      href: links.x,
      icon: <FaXTwitter />,
      label: labels.x,
    },
    {
      active: "#0059c7",
      bg: "#007bff",
      hover: "#0068e6",
      href: links.bluesky,
      icon: <SiBluesky />,
      label: labels.bluesky,
    },
    {
      active: "#191c20",
      bg: "#24292f",
      hover: "#1f2328",
      href: links.github,
      icon: <FaGithub />,
      label: labels.github,
    },
    {
      active: "#2a2a2a",
      bg: "#101010",
      hover: "#1a1a1a",
      href: links.threads,
      icon: <SiThreads />,
      label: labels.threads,
    },
  ];

  return {
    heading: labels.heading,
    items,
  };
};

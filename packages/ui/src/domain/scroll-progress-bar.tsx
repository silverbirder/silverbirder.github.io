"use client";

import { Box } from "@chakra-ui/react";

type Props = {
  className?: string;
  color?: string;
  height?: string;
  left?: string;
  position?: "absolute" | "fixed" | "relative" | "sticky";
  right?: string;
  top?: string;
  zIndex?: number;
};

const baseClassName = "scroll-progress-bar";

export const ScrollProgressBar = ({
  className,
  color = "var(--chakra-colors-green-border)",
  height = "3px",
  left = "0",
  position = "fixed",
  right = "0",
  top = "0",
  zIndex = 1000,
}: Props) => {
  const classNames = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  const styleText = `
    .${baseClassName} {
      position: ${position};
      top: ${top};
      left: ${left};
      right: ${right};
      width: 100%;
      height: ${height};
      background: ${color};
      transform-origin: 0 0;
      animation: ${baseClassName}-animation linear;
      animation-timeline: scroll();
      z-index: ${zIndex};
    }

    @keyframes ${baseClassName}-animation {
      from { scale: 0 1; }
      to { scale: 1 1; }
    }
  `;

  return (
    <>
      <style>{styleText}</style>
      <Box
        aria-hidden="true"
        className={classNames}
        data-testid="scroll-progress-bar"
      />
    </>
  );
};

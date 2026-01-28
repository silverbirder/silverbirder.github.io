"use client";

import { useId } from "react";

type Props = {
  height: number;
  patternWidth?: number;
};

export const NotebookDash = ({ height, patternWidth = 16 }: Props) => {
  const id = useId();
  const patternId = `notebook-dash-${id}`;
  const bottomValue = `-${height}px`;

  return (
    <svg
      style={{
        bottom: bottomValue,
        height: `${height}px`,
        left: 0,
        position: "absolute",
        width: "100%",
      }}
    >
      <defs>
        <pattern
          height={height}
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={patternWidth}
        >
          <path
            d={`M 0 0 H 2 V ${height - 1} A 1 1 0 0 1 1 ${height} A 1 1 0 0 1 0 ${height - 1} Z`}
            fill="var(--chakra-colors-border)"
          />
        </pattern>
      </defs>
      <rect
        fill={`url(#${patternId})`}
        height="100%"
        width="100%"
        x={0}
        y={0}
      />
    </svg>
  );
};

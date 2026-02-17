"use client";

import { chakra } from "@chakra-ui/react";

type Layer = {
  index: number;
  y: number;
};

type Props = {
  className?: string;
  count: number;
};

const RECT_WIDTH = 240;
const RECT_HEIGHT = 180;
const BASE_X = 60;
const BASE_Y = 90;
const PAPER_SKEW_OFFSET = 36;
const PAPER_LINE_START_OFFSET = 24;
const PAPER_LINE_GAP = 24;

type Point = {
  x: number;
  y: number;
};

const getPaperCorners = (x: number, y: number): Point[] => [
  { x: x + PAPER_SKEW_OFFSET, y },
  { x: x + RECT_WIDTH, y },
  { x: x + RECT_WIDTH - PAPER_SKEW_OFFSET, y: y + RECT_HEIGHT },
  { x, y: y + RECT_HEIGHT },
];

export const PaperStack = ({ className, count }: Props) => {
  const layers: Layer[] = Array.from({ length: count }, (_, index) => ({
    index,
    y: BASE_Y + index * -20,
  }));

  return (
    <chakra.svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="100%"
      preserveAspectRatio="xMinYMax meet"
      viewBox="0 0 300 600"
      width="100%"
    >
      <chakra.g transform="translate(0 250)">
        {layers.map(({ index, y }) => (
          <chakra.g key={`paper-${index}`}>
            <chakra.polygon
              data-testid="paper-layer"
              fill="bg"
              points={getPaperCorners(BASE_X, y)
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
              stroke="green.border"
              strokeWidth={2}
            />
            {Array.from(
              {
                length:
                  Math.floor(
                    (RECT_HEIGHT - 24 - PAPER_LINE_START_OFFSET) /
                      PAPER_LINE_GAP,
                  ) + 1,
              },
              (_, lineIndex) =>
                PAPER_LINE_START_OFFSET + lineIndex * PAPER_LINE_GAP,
            ).map((offset) => {
              const yOffset = offset;
              const xShift = (PAPER_SKEW_OFFSET * yOffset) / RECT_HEIGHT;
              const leftX = BASE_X + PAPER_SKEW_OFFSET - xShift;
              const rightX = BASE_X + RECT_WIDTH - xShift;
              const lineY = y + yOffset;
              return (
                <chakra.line
                  data-testid="paper-line"
                  key={`paper-${index}-line-${offset}`}
                  stroke="green.fg"
                  strokeOpacity={0.2}
                  strokeWidth={1.5}
                  x1={leftX}
                  x2={rightX}
                  y1={lineY}
                  y2={lineY}
                />
              );
            })}
          </chakra.g>
        ))}
      </chakra.g>
    </chakra.svg>
  );
};

"use client";

import { chakra } from "@chakra-ui/react";

type Layer = {
  cx: number;
  cy: number;
  index: number;
  x: number;
  y: number;
};

type Props = {
  className?: string;
  count: number;
  maxCount: number;
};

const RECT_WIDTH = 240;
const RECT_HEIGHT = 180;
const STROKE_WIDTH = 2;
const ROTATE_DEGREE = -45;
const BASE_X = 60;
const BASE_Y = 90;
const STEP_X = 0;
const STEP_Y = -30;
const VIEWBOX_PADDING = 12;
const PAPER_SKEW_OFFSET = 36;
const PAPER_LINE_START_OFFSET = 12;
const PAPER_LINE_END_OFFSET = RECT_WIDTH - PAPER_SKEW_OFFSET - 24;
const PAPER_LINE_GAP = 24;
const PAPER_LINE_STROKE_WIDTH = 1.5;

type Point = {
  x: number;
  y: number;
};

const rotatePoint = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  radian: number,
) => {
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  const dx = x - cx;
  const dy = y - cy;

  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
};

const getPaperCorners = (x: number, y: number): Point[] => [
  { x: x + PAPER_SKEW_OFFSET, y },
  { x: x + RECT_WIDTH, y },
  { x: x + RECT_WIDTH - PAPER_SKEW_OFFSET, y: y + RECT_HEIGHT },
  { x, y: y + RECT_HEIGHT },
];

const paperLineOffsets: number[] = [];

for (
  let offset = PAPER_LINE_START_OFFSET;
  offset <= PAPER_LINE_END_OFFSET;
  offset += PAPER_LINE_GAP
) {
  paperLineOffsets.push(offset);
}

const createLayer = (index: number): Layer => {
  const x = BASE_X + index * STEP_X;
  const y = BASE_Y + index * STEP_Y;
  const cx = x + RECT_WIDTH / 2;
  const cy = y + RECT_HEIGHT / 2;

  return { cx, cy, index, x, y };
};

const getBoundsFromLayerCount = (
  layerCount: number,
  radian: number,
  strokePadding: number,
) => {
  return Array.from({ length: layerCount }, (_, index) =>
    createLayer(index),
  ).reduce(
    (acc, layer) => {
      const { cx, cy, x, y } = layer;

      const corners = getPaperCorners(x, y).map((point) =>
        rotatePoint(point.x, point.y, cx, cy, radian),
      );

      const minX = Math.min(...corners.map((point) => point.x)) - strokePadding;
      const maxX = Math.max(...corners.map((point) => point.x)) + strokePadding;
      const minY = Math.min(...corners.map((point) => point.y)) - strokePadding;
      const maxY = Math.max(...corners.map((point) => point.y)) + strokePadding;

      return {
        maxX: Math.max(acc.maxX, maxX),
        maxY: Math.max(acc.maxY, maxY),
        minX: Math.min(acc.minX, minX),
        minY: Math.min(acc.minY, minY),
      };
    },
    {
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
    },
  );
};

export const PaperStack = ({ className, count, maxCount }: Props) => {
  if (count <= 0) {
    return (
      <chakra.svg aria-hidden="true" className={className} viewBox="0 0 1 1" />
    );
  }

  const radian = (ROTATE_DEGREE * Math.PI) / 180;
  const strokePadding = STROKE_WIDTH / 2;
  const layers = Array.from({ length: count }, (_, index) =>
    createLayer(index),
  );
  const referenceLayerCount = maxCount > 0 ? maxCount : count;
  const boundsLayerCount = Math.max(count, referenceLayerCount);
  const bounds = getBoundsFromLayerCount(
    boundsLayerCount,
    radian,
    strokePadding,
  );

  const viewBoxWidth = bounds.maxX - bounds.minX + VIEWBOX_PADDING * 2;
  const viewBoxHeight = bounds.maxY - bounds.minY + VIEWBOX_PADDING * 2;
  const translateX = VIEWBOX_PADDING - bounds.minX;
  const translateY = VIEWBOX_PADDING - bounds.minY;

  return (
    <chakra.svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="100%"
      preserveAspectRatio="xMinYMax meet"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width="100%"
    >
      <chakra.g transform={`translate(${translateX} ${translateY})`}>
        {layers.map(({ cx, cy, index, x, y }) => (
          <chakra.g
            key={`paper-${index}`}
            transform={`rotate(${ROTATE_DEGREE} ${cx} ${cy})`}
          >
            <chakra.polygon
              data-testid="paper-layer"
              fill="bg"
              points={getPaperCorners(x, y)
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
              stroke="green.border"
              strokeWidth={STROKE_WIDTH}
            />
            {paperLineOffsets.map((offset) => {
              const topX = x + PAPER_SKEW_OFFSET + offset;
              const bottomX = x + offset;
              return (
                <chakra.line
                  data-testid="paper-line"
                  key={`paper-${index}-line-${offset}`}
                  stroke="green.fg"
                  strokeOpacity={0.2}
                  strokeWidth={PAPER_LINE_STROKE_WIDTH}
                  x1={topX}
                  x2={bottomX}
                  y1={y}
                  y2={y + RECT_HEIGHT}
                />
              );
            })}
          </chakra.g>
        ))}
      </chakra.g>
    </chakra.svg>
  );
};

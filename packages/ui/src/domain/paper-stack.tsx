"use client";

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

export const PaperStack = ({ className, count }: Props) => {
  if (count <= 0) {
    return <svg aria-hidden="true" className={className} viewBox="0 0 1 1" />;
  }

  const radian = (ROTATE_DEGREE * Math.PI) / 180;
  const strokePadding = STROKE_WIDTH / 2;
  const layers: Layer[] = [];

  for (let index = 0; index < count; index += 1) {
    const x = BASE_X + index * STEP_X;
    const y = BASE_Y + index * STEP_Y;
    const cx = x + RECT_WIDTH / 2;
    const cy = y + RECT_HEIGHT / 2;
    layers.push({ cx, cy, index, x, y });
  }

  const bounds = layers.reduce(
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

  const viewBoxWidth = bounds.maxX - bounds.minX + VIEWBOX_PADDING * 2;
  const viewBoxHeight = bounds.maxY - bounds.minY + VIEWBOX_PADDING * 2;
  const translateX = VIEWBOX_PADDING - bounds.minX;
  const translateY = VIEWBOX_PADDING - bounds.minY;

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="100%"
      preserveAspectRatio="xMinYMin meet"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width="100%"
    >
      <g transform={`translate(${translateX} ${translateY})`}>
        {layers.map(({ cx, cy, index, x, y }) => (
          <g
            key={`paper-${index}`}
            transform={`rotate(${ROTATE_DEGREE} ${cx} ${cy})`}
          >
            <polygon
              data-testid="paper-layer"
              fill="white"
              points={getPaperCorners(x, y)
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
              stroke="black"
              strokeWidth={STROKE_WIDTH}
            />
            {paperLineOffsets.map((offset) => {
              const topX = x + PAPER_SKEW_OFFSET + offset;
              const bottomX = x + offset;
              return (
                <line
                  data-testid="paper-line"
                  key={`paper-${index}-line-${offset}`}
                  stroke="black"
                  strokeOpacity={0.2}
                  strokeWidth={PAPER_LINE_STROKE_WIDTH}
                  x1={topX}
                  x2={bottomX}
                  y1={y}
                  y2={y + RECT_HEIGHT}
                />
              );
            })}
          </g>
        ))}
      </g>
    </svg>
  );
};

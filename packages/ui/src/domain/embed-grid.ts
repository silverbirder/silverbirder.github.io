"use client";

import { useEffect, useRef, useState } from "react";

const resolveNotebookLineHeightPxFromElement = (element: HTMLElement) => {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.getComputedStyle(element).lineHeight;
  const px = Number.parseFloat(value);
  if (!Number.isFinite(px) || px <= 0) {
    return null;
  }
  return px;
};

const computePaddingToNextMultiple = (heightPx: number, unitPx: number) => {
  if (!Number.isFinite(heightPx) || !Number.isFinite(unitPx) || unitPx <= 0) {
    return 0;
  }
  const remainder = heightPx % unitPx;
  if (remainder < 0.5 || unitPx - remainder < 0.5) {
    return 0;
  }
  return unitPx - remainder;
};

export const useNotebookLineGridPadding = <
  Element extends HTMLElement = HTMLDivElement,
>() => {
  const ref = useRef<Element | null>(null);
  const [paddingBottomPx, setPaddingBottomPx] = useState(0);
  const paddingBottomPxRef = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    let rafId = 0;
    const update = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        const notebookLineHeightPx =
          resolveNotebookLineHeightPxFromElement(element);
        if (!notebookLineHeightPx) {
          return;
        }
        const measuredOuter = element.getBoundingClientRect().height;
        const measuredBase = Math.max(
          0,
          measuredOuter - paddingBottomPxRef.current,
        );
        const nextPadding = computePaddingToNextMultiple(
          measuredBase,
          notebookLineHeightPx,
        );
        setPaddingBottomPx((prev) => {
          const resolved =
            Math.abs(prev - nextPadding) < 0.5 ? prev : nextPadding;
          paddingBottomPxRef.current = resolved;
          return resolved;
        });
      });
    };

    update();

    if (typeof ResizeObserver === "undefined") {
      return () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }

    const observer = new ResizeObserver(() => {
      update();
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return {
    paddingBottom: paddingBottomPx ? `${paddingBottomPx}px` : undefined,
    ref,
  };
};

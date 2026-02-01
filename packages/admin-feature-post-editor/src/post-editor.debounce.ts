"use client";

import { useCallback, useEffect, useRef } from "react";

type DebouncedCallback<Args extends unknown[]> = {
  cancel: () => void;
  schedule: (...args: Args) => void;
};

export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => Promise<void> | void,
  delayMs: number,
): DebouncedCallback<Args> => {
  const timeoutRef = useRef<null | number>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const schedule = useCallback(
    (...args: Args) => {
      cancel();
      timeoutRef.current = window.setTimeout(() => {
        void callback(...args);
      }, delayMs);
    },
    [callback, cancel, delayMs],
  );

  useEffect(() => cancel, [cancel]);

  return { cancel, schedule };
};

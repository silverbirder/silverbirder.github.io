import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { useDebouncedCallback } from "./post-editor.debounce";

describe("useDebouncedCallback", () => {
  it("invokes callback after the delay", async () => {
    vi.useFakeTimers();

    try {
      const callback = vi.fn();
      const scheduleRef = { current: null as ((value: string) => void) | null };

      const Test = () => {
        const result = useDebouncedCallback(callback, 200);
        scheduleRef.current = result.schedule;
        return null;
      };

      render(<Test />);

      scheduleRef.current?.("value");

      expect(callback).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(200);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith("value");
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps only the latest scheduled call", async () => {
    vi.useFakeTimers();

    try {
      const callback = vi.fn();
      const scheduleRef = { current: null as ((value: string) => void) | null };

      const Test = () => {
        const result = useDebouncedCallback(callback, 200);
        scheduleRef.current = result.schedule;
        return null;
      };

      render(<Test />);

      scheduleRef.current?.("first");
      await vi.advanceTimersByTimeAsync(100);
      scheduleRef.current?.("second");
      await vi.advanceTimersByTimeAsync(200);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith("second");
    } finally {
      vi.useRealTimers();
    }
  });
});

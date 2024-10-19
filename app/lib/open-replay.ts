"use client";

import { useEffect } from "react";
import Tracker from "@openreplay/tracker";

const Openreplay = () => {
  const projectKey = process.env.NEXT_PUBLIC_OPEN_REPLAY_PROJECT_KEY ?? "";
  useEffect(() => {
    if (projectKey && typeof window !== "undefined") {
      const tracker = new Tracker({
        projectKey,
      });
      tracker.start();
    }
  }, [projectKey]);

  return null;
};

export default Openreplay;

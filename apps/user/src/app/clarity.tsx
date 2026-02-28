"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

type Props = {
  projectId?: string;
};

export const ClarityScript = ({ projectId }: Props) => {
  useEffect(() => {
    if (!projectId) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }

    Clarity.init(projectId);
  }, [projectId]);

  return null;
};

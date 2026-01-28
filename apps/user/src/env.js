/* global process */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().optional(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    GA_ID: process.env.GA_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  server: {
    GA_ID: z.string().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

void env;

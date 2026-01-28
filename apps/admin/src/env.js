/* global process */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
  },

  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    ADMIN_ALLOWED_EMAILS: process.env.ADMIN_ALLOWED_EMAILS,
    BETTER_AUTH_GITHUB_CLIENT_ID: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
    BETTER_AUTH_GITHUB_CLIENT_SECRET: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    CONTENT_GITHUB_BASE_BRANCH: process.env.CONTENT_GITHUB_BASE_BRANCH,
    CONTENT_GITHUB_REPOSITORY: process.env.CONTENT_GITHUB_REPOSITORY,
    CONTENT_POSTS_PATH: process.env.CONTENT_POSTS_PATH,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    ADMIN_ALLOWED_EMAILS: z.string(),
    BETTER_AUTH_GITHUB_CLIENT_ID: z.string(),
    BETTER_AUTH_GITHUB_CLIENT_SECRET: z.string(),
    BETTER_AUTH_SECRET:
      process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
    CLOUDINARY_FOLDER: z.string().optional(),
    CLOUDINARY_URL: z.string(),
    CONTENT_GITHUB_BASE_BRANCH: z.string().default("main"),
    CONTENT_GITHUB_REPOSITORY: z
      .string()
      .default("silverbirder/silverbirder.github.io"),
    CONTENT_POSTS_PATH: z.string().default("packages/content/posts"),
    NODE_ENV: z
      .enum(["development", "test", "production"]) 
      .default("development"),
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

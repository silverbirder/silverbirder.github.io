import { cloudinaryRouter } from "@/server/api/routers/cloudinary";
import { draftRouter } from "@/server/api/routers/draft";
import { githubRouter } from "@/server/api/routers/github";
import { hatenaRouter } from "@/server/api/routers/hatena";
import { mdxRouter } from "@/server/api/routers/mdx";
import { zennRouter } from "@/server/api/routers/zenn";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  cloudinary: cloudinaryRouter,
  draft: draftRouter,
  github: githubRouter,
  hatena: hatenaRouter,
  mdx: mdxRouter,
  zenn: zennRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

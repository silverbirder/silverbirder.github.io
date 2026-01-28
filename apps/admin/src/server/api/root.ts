import { cloudinaryRouter } from "@/server/api/routers/cloudinary";
import { githubRouter } from "@/server/api/routers/github";
import { mdxRouter } from "@/server/api/routers/mdx";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  cloudinary: cloudinaryRouter,
  github: githubRouter,
  mdx: mdxRouter,
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

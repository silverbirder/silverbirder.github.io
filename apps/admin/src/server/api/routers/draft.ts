import { randomUUID } from "node:crypto";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const saveDraftInputSchema = z.object({
  body: z.string(),
  hatenaEnabled: z.boolean().optional(),
  id: z.string().min(1).optional(),
  publishedAt: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  title: z.string(),
  zennEnabled: z.boolean().optional(),
  zennType: z.string().optional(),
});

export const draftRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async () => {
      return { deleted: false };
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async () => {
      return null;
    }),

  list: protectedProcedure.query(async () => {
    return [];
  }),

  save: protectedProcedure
    .input(saveDraftInputSchema)
    .mutation(async ({ input }) => {
      const now = new Date().toISOString();
      const id = input.id ?? randomUUID();

      return {
        id,
        updatedAt: now,
      };
    }),
});

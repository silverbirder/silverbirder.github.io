import { TRPCError } from "@trpc/server";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const draftFilePath = path.join(
  tmpdir(),
  "silverbirder-admin-post-drafts.json",
);

const storedDraftSchema = z.object({
  body: z.string(),
  hatenaEnabled: z.boolean(),
  id: z.string().min(1),
  publishedAt: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  title: z.string(),
  updatedAt: z.string(),
  zennEnabled: z.boolean(),
  zennType: z.string(),
});

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

const sortDrafts = (
  drafts: Array<z.infer<typeof storedDraftSchema>>,
): Array<z.infer<typeof storedDraftSchema>> => {
  return [...drafts].sort((left, right) => {
    const leftDate = Date.parse(left.updatedAt);
    const rightDate = Date.parse(right.updatedAt);
    const leftValue = Number.isNaN(leftDate) ? 0 : leftDate;
    const rightValue = Number.isNaN(rightDate) ? 0 : rightDate;

    if (rightValue !== leftValue) {
      return rightValue - leftValue;
    }

    return left.id.localeCompare(right.id);
  });
};

const readDrafts = async (): Promise<
  Array<z.infer<typeof storedDraftSchema>>
> => {
  try {
    const raw = await readFile(draftFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const result = z.array(storedDraftSchema).safeParse(parsed);
    if (!result.success) {
      return [];
    }
    return sortDrafts(result.data);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to read post drafts.",
    });
  }
};

const writeDrafts = async (
  drafts: Array<z.infer<typeof storedDraftSchema>>,
) => {
  await mkdir(path.dirname(draftFilePath), { recursive: true });
  await writeFile(
    draftFilePath,
    JSON.stringify(sortDrafts(drafts), null, 2),
    "utf8",
  );
};

export const draftRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const drafts = await readDrafts();
      const nextDrafts = drafts.filter((draft) => draft.id !== input.id);

      if (nextDrafts.length === drafts.length) {
        return { deleted: false };
      }

      await writeDrafts(nextDrafts);

      return { deleted: true };
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const drafts = await readDrafts();
      const draft = drafts.find((entry) => entry.id === input.id);
      return draft ?? null;
    }),

  list: protectedProcedure.query(async () => {
    const drafts = await readDrafts();
    return drafts.map((draft) => ({
      id: draft.id,
      publishedAt: draft.publishedAt,
      title: draft.title,
      updatedAt: draft.updatedAt,
    }));
  }),

  save: protectedProcedure
    .input(saveDraftInputSchema)
    .mutation(async ({ input }) => {
      const drafts = await readDrafts();
      const now = new Date().toISOString();
      const id = input.id ?? randomUUID();

      const nextDraft = {
        body: input.body,
        hatenaEnabled: input.hatenaEnabled ?? false,
        id,
        publishedAt: input.publishedAt,
        summary: input.summary,
        tags: input.tags,
        title: input.title,
        updatedAt: now,
        zennEnabled: input.zennEnabled ?? false,
        zennType: input.zennType ?? "tech",
      };

      const nextDrafts = drafts.filter((draft) => draft.id !== id);
      nextDrafts.push(nextDraft);

      await writeDrafts(nextDrafts);

      return {
        id,
        updatedAt: now,
      };
    }),
});

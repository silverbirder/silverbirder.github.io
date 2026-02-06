import { sql } from "drizzle-orm";
import { pgTableCreator, primaryKey } from "drizzle-orm/pg-core";

/**
 * Shared Drizzle schema for apps/api.
 */
export const createTable = pgTableCreator((name) => `silverbirder_${name}`);

export const likes = createTable("like", (d) => ({
  count: d.integer("count").notNull().default(0),
  createdAt: d
    .timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  slug: d.text("slug").primaryKey(),
  updatedAt: d
    .timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}));

export const likeUsers = createTable(
  "like_user",
  (d) => ({
    anonId: d.text("anon_id").notNull(),
    createdAt: d
      .timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    slug: d.text("slug").notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.slug, table.anonId] }),
  }),
);

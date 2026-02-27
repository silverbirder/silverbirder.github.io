import { sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";

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

export const comments = createTable(
  "comment",
  (d) => ({
    authorAnonIdHash: d.text("author_anon_id_hash").notNull(),
    body: d.varchar("body", { length: 255 }).notNull(),
    createdAt: d
      .timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    id: d.serial("id").primaryKey(),
    slug: d.text("slug").notNull(),
  }),
  (table) => ({
    authorAnonIdHashIdx: index("comment_author_anon_id_hash_idx").on(
      table.authorAnonIdHash,
    ),
    slugCreatedAtIdx: index("comment_slug_created_at_idx").on(
      table.slug,
      table.createdAt,
    ),
  }),
);

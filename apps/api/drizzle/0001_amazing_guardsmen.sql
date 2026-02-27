CREATE TABLE "silverbirder_comment" (
	"author_anon_id_hash" text NOT NULL,
	"body" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "comment_author_anon_id_hash_idx" ON "silverbirder_comment" USING btree ("author_anon_id_hash");--> statement-breakpoint
CREATE INDEX "comment_slug_created_at_idx" ON "silverbirder_comment" USING btree ("slug","created_at");
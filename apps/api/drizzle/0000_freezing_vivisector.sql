CREATE TABLE "silverbirder_like_user" (
	"slug" text NOT NULL,
	"anon_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "silverbirder_like_user_slug_anon_id_pk" PRIMARY KEY("slug","anon_id")
);
--> statement-breakpoint
CREATE TABLE "silverbirder_like" (
	"slug" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

const resolvedConnectionString =
  connectionString ?? "postgres://user:password@localhost:5432/database";

if (!connectionString) {
  console.warn(
    "DATABASE_URL or POSTGRES_URL is not set. Using placeholder connection string for tooling.",
  );
}

export default defineConfig({
  dbCredentials: {
    url: resolvedConnectionString,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/db/schema.ts",
});

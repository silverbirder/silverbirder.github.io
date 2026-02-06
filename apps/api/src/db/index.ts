import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL or POSTGRES_URL is required to connect to Postgres.",
  );
}

const client = postgres(connectionString, { max: 1 });

export const db = drizzle(client);

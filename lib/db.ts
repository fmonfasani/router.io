import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/db/schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is missing");
}

export const pool = new Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false }, // necesario en Neon
});

export const db = drizzle(pool, { schema });

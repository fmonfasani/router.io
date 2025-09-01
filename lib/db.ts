import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db";

let db: ReturnType<typeof drizzle> | undefined;

if (typeof window === "undefined") {
  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // o { rejectUnauthorized: false } si tu proveedor requiere SSL
  });
  db = drizzle(pool, { schema });
}

export { db };

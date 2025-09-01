import "dotenv/config";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: "lib/db/drizzle" });
  await pool.end();
  console.log("✅ Migraciones aplicadas");
}

main().catch((e) => {
  console.error("❌ Migraciones fallaron:", e);
  process.exit(1);
});

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const config = useRuntimeConfig()

const pool = new pg.Pool({
  connectionString: config.db.url
});
pool.connect();

export const db = drizzle(pool, {
  schema: dbTables
});
export const luciaDbAdapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

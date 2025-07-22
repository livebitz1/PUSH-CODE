import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool = null;
let db = null;
if (!process.env.DATABASE_URL) {
  console.warn("Warning: DATABASE_URL is not set. Database functionality will be disabled, but the website will still load.");
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}
export { pool, db };
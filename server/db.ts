import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true;

export const db = drizzle(process.env.DATABASE_URL);

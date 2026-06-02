import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "Collaborate" ("id" text PRIMARY KEY NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "phone" text NOT NULL, "position" text, "request" text NOT NULL, "createdAt" timestamp DEFAULT now());
  `);
  console.log("Created successfully");
  process.exit(0);
}

run();

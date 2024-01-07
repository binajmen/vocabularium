import "dotenv/config";
import { type Config } from "drizzle-kit";

console.log(process.env.DATABASE_URL);

export default {
  schema: "./app/database/schema.server.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;

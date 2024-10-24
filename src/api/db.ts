import { createClient } from "@libsql/client/sqlite3";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "~/database/schema";

const client = createClient({
  url: "file:db.sqlite",
});

export const db = drizzle(client, { schema });

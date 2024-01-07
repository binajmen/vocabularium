import { json, redirect } from "@remix-run/node";
import { sql } from "drizzle-orm";
import { db } from "~/database/db.server";
import {
  nouns,
  type Noun,
  Verb,
  verbs,
  Other,
  others,
} from "~/database/schema.server";
import { TERM_TYPES } from "~/lib/constants";

// TOFIX: order by random() is bad on large table
// sql`select * from ${lexicon} tablesample bernoulli(1) order by random() limit 1`,

export async function loader() {
  const randomType = Math.floor(Math.random() * TERM_TYPES.length);

  switch (TERM_TYPES[randomType]) {
    case "noun": {
      const rows = await db.execute<Noun>(
        sql`select * from ${nouns} order by random() limit 1`
      );
      if (rows.length > 0) {
        throw redirect(`/noun/${rows[0].id}/question`);
      }
      break;
    }
    case "verb": {
      const rows = await db.execute<Verb>(
        sql`select * from ${verbs} order by random() limit 1`
      );
      if (rows.length > 0) {
        throw redirect(`/verb/${rows[0].id}/question`);
      }
      break;
    }
    case "other": {
      const rows = await db.execute<Other>(
        sql`select * from ${others} order by random() limit 1`
      );
      if (rows.length > 0) {
        throw redirect(`/other/${rows[0].id}/question`);
      }
      break;
    }
  }

  throw new Error("Wrong random index");
}

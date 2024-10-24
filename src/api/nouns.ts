"use server";
import { aliasedTable, and, eq, getTableColumns } from "drizzle-orm";
import { lexicon, nouns } from "~/database/schema";
import { db } from "./db";

export async function createNoun(values: typeof nouns.$inferInsert) {
  return db.insert(nouns).values(values);
}

export async function getNoun(
  lexicon_id: string,
  from_lang: string,
  to_lang: string,
) {
  const from = aliasedTable(nouns, "from");
  const to = aliasedTable(nouns, "to");
  return db
    .select({
      type: lexicon.type,
      from: getTableColumns(from),
      to: getTableColumns(to),
    })
    .from(lexicon)
    .leftJoin(
      from,
      and(eq(from.lexicon_id, lexicon.id), eq(from.lang, from_lang)),
    )
    .leftJoin(to, and(eq(to.lexicon_id, lexicon.id), eq(to.lang, to_lang)))
    .where(eq(lexicon.id, lexicon_id));
}

"use server";
import { lexicon } from "~/database/schema";
import { db } from "./db";

export async function createLexicon(values: typeof lexicon.$inferInsert) {
  return db.insert(lexicon).values(values);
}

"use server";
import { nouns } from "~/database/schema";
import { db } from "./db";

export async function createNoun(values: typeof nouns.$inferInsert) {
  return db.insert(nouns).values(values);
}

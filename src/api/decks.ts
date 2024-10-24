import { decks } from "~/database/schema";
import { db } from "./db";

export async function createDeck(values: typeof decks.$inferInsert) {
  return db.insert(decks).values(values);
}

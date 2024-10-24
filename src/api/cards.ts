import { cards } from "~/database/schema";
import { db } from "./db";

export async function createCard(values: typeof cards.$inferInsert) {
  return db.insert(cards).values(values);
}

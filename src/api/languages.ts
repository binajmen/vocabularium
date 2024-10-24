"use server";
import { languages } from "~/database/schema";
import { db } from "./db";

export async function createLanguage(values: typeof languages.$inferInsert) {
  return db.insert(languages).values(values);
}

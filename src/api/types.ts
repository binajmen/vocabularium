"use server";
import { types } from "~/database/schema";
import { db } from "./db";

export async function createType(values: typeof types.$inferInsert) {
  return db.insert(types).values(values);
}

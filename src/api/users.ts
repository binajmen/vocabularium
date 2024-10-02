"use server";
import { users } from "~/database/schema";
import { db } from "./db";

export async function getUsers() {
  return db.select().from(users).all();
}

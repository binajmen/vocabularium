"use server";
import * as argon2 from "argon2";
import { passwords, users } from "~/database/schema";
import { db } from "./db";

export async function createUser(values: typeof users.$inferInsert) {
  return db.insert(users).values(values);
}

export async function createPassword(user_id: string, password: string) {
  const hash = await argon2.hash(password);
  return db.insert(passwords).values({ user_id, hash });
}

export async function getUsers() {
  return db.select().from(users).all();
}

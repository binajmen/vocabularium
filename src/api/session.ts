"use server";
import { redirect } from "@solidjs/router";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { useSession } from "vinxi/http";
import { passwords, users } from "~/database/schema";
import { db } from "./db";

type Session = {
  userId?: string;
};

function getSession() {
  return useSession<Session>({
    password:
      process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace",
  });
}

async function login(email: string, password: string) {
  const row = db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .innerJoin(passwords, eq(passwords.user_id, users.id))
    .get();
  const hash = await argon2.hash(password);
  if (!row || hash !== row.passwords.hash) throw new Error("Invalid login");
  return row.users;
}

async function register(email: string, password: string) {
  const existingUser = db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();
  if (existingUser) throw new Error("User already exists");

  const hash = await argon2.hash(password);
  return db.transaction(async (tx) => {
    const user = tx
      .insert(users)
      .values({ email, first_name: "", last_name: "" })
      .returning()
      .get();
    await tx.insert(passwords).values({ user_id: user.id, hash: hash });
    return user;
  });
}

function validateEmail(email: unknown) {
  if (typeof email !== "string" || email.length < 3) {
    return "emails must be at least 3 characters long";
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}

export async function loginOrRegister(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  const error = validateEmail(email) || validatePassword(password);
  if (error) return new Error(error);

  try {
    const user = await (loginType !== "login"
      ? register(email, password)
      : login(email, password));
    const session = await getSession();
    await session.update(() => ({ userId: user.id }));
  } catch (err) {
    return err as Error;
  }
  throw redirect("/");
}

export async function logout() {
  const session = await getSession();
  await session.update(() => ({ userId: undefined }));
  throw redirect("/login");
}

export async function getUserBySession() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");

  try {
    const user = db.select().from(users).where(eq(users.id, userId)).get();
    if (!user) throw redirect("/login");
    return user;
  } catch {
    throw logout();
  }
}

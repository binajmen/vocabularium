import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { users } from "./schema.server";

export async function getUserOrNull(userId: string) {
  const user = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user.length === 1 ? user[0] : null;
}

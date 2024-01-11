import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { and, eq } from "drizzle-orm";
import { db } from "~/database/db.server";
import { cards, lexicon } from "~/database/schema.server";
import { requireAuthCookie } from "~/lib/auth.server";
import { http } from "~/lib/http-responses";
import { sm2 } from "~/lib/sm2.server";
import { addDays } from "date-fns";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const lexiconId = url.searchParams.get("id");
  const grade = Number(url.searchParams.get("grade"));
  const userId = await requireAuthCookie(request);

  if (!lexiconId || !grade) {
    return http.badRequest({ message: "Missing id or score" });
  }

  const card = await getCardOrUndefined(userId, lexiconId);
  const properties = sm2({ ...card, grade });
  const updatedAt = addDays(new Date(), properties.interval);

  console.log({ grade, properties });

  await db
    .insert(cards)
    .values({ ...properties, userId, lexiconId, updatedAt })
    .onConflictDoUpdate({
      target: [cards.userId, cards.lexiconId],
      set: { ...properties, updatedAt },
    });

  return redirect("/random");
}

async function getCardOrUndefined(userId: string, lexiconId: string) {
  return db.query.cards.findFirst({
    where: and(eq(cards.userId, userId), eq(cards.lexiconId, lexiconId)),
  });
}

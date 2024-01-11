import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { and, eq, getTableColumns, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "~/database/db.server";
import { cards, lexicon } from "~/database/schema.server";
import { getAuthFromRequest } from "~/lib/auth.server";
import { http } from "~/lib/http-responses";

// TOFIX: order by random() is bad on large table
// sql`select * from ${lexicon} tablesample bernoulli(1) order by random() limit 1`,

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getAuthFromRequest(request);

  if (userId) {
    const rows = await db
      .select({ ...getTableColumns(lexicon) })
      .from(lexicon)
      .leftJoin(
        cards,
        and(eq(cards.userId, userId), eq(cards.lexiconId, lexicon.id))
      )
      .where(or(isNull(cards.updatedAt), lte(cards.updatedAt, new Date())))
      .orderBy(sql`random()`)
      .limit(1);

    if (rows.length > 0) {
      return redirect(`/${rows[0].type}/${rows[0].id}/question`);
    } else {
      return redirect("/come-back-later");
    }
  } else {
    const rows = await db
      .select()
      .from(lexicon)
      .orderBy(sql`random()`)
      .limit(1);

    if (rows.length > 0) {
      return redirect(`/${rows[0].type}/${rows[0].id}/question`);
    }
  }

  throw http.notFound("Unable to find a random card");
}

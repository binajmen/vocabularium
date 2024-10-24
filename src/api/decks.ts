"use server";
import { eq } from "drizzle-orm";
import { cards, decks, lexicon } from "~/database/schema";
import { db } from "./db";
import { getNoun } from "./nouns";

export async function createDeck(values: typeof decks.$inferInsert) {
  return db.insert(decks).values(values);
}

export async function getDeckWithCards(id: string) {
  const deck = await db.select().from(decks).where(eq(decks.id, id)).get();
  if (!deck) {
    return null;
  }

  const _cards = await db
    .select()
    .from(cards)
    .innerJoin(lexicon, eq(lexicon.id, cards.lexicon_id))
    .where(eq(cards.deck_id, id));

  // FIXME: avoid the N+1 problem by querying each type together
  const __cards = await Promise.all(
    _cards.map((card) => {
      switch (card.lexicon.type) {
        case "noun": {
          return getNoun(card.lexicon.id, "fr", deck.lang);
        }
      }
    }),
  );

  return {
    ...deck,
    cards: __cards,
  };
}

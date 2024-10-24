import { createCard } from "~/api/cards";
import { createDeck } from "~/api/decks";
import { createLanguage } from "~/api/languages";
import { createLexicon } from "~/api/lexicon";
import { createNoun } from "~/api/nouns";
import { createType } from "~/api/types";
import { createPassword, createUser } from "~/api/users";

async function seed() {
  await createUser({
    id: "binajmen",
    email: "hey@binaj.dev",
    first_name: "Benjamin",
    last_name: "Void",
  });
  await createPassword("binajmen", "password");

  await createLanguage({ lang: "de" });
  await createLanguage({ lang: "en" });
  await createLanguage({ lang: "fr" });

  await createType({ id: "noun" });
  await createType({ id: "verb" });

  await createLexicon({ id: "book", type: "noun" });

  await createNoun({
    lexicon_id: "book",
    lang: "en",
    gender: "neutral",
    article: "the",
    singular: "book",
    plural: "books",
    example: "Where is my book?",
  });
  await createNoun({
    lexicon_id: "book",
    lang: "fr",
    gender: "neutral",
    article: "le",
    singular: "livre",
    plural: "livres",
    example: "Vois-tu mon livre?",
  });
  await createNoun({
    lexicon_id: "book",
    lang: "de",
    gender: "neutral",
    article: "das",
    singular: "buch",
    plural: "bücher",
    example: "Wo ist mein Buch?",
  });

  await createDeck({
    id: "deck",
    name: "Deck",
    user_id: "binajmen",
    lang: "de",
  });

  await createCard({ deck_id: "deck", lexicon_id: "book" });
}

seed()
  .then(() => console.log("seeding complete"))
  .catch((error) => console.error("seeding failed", error));

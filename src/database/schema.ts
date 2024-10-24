import {
  blob,
  index,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

const id = (name: string) =>
  text(name)
    .primaryKey()
    .$default(() => nanoid());

export const users = sqliteTable("users", {
  id: id("id"),
  email: text("email").notNull().unique(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
});

export const passwords = sqliteTable("passwords", {
  user_id: id("user_id").references(() => users.id),
  hash: text("hash").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: id("id"),
  user_id: text("user_id").references(() => users.id),
});

export const languages = sqliteTable("languages", {
  lang: id("lang"),
});

export const types = sqliteTable("types", {
  id: id("id"),
});

export const lexicon = sqliteTable("lexicon", {
  id: id("id"),
  type: text("type")
    .references(() => types.id)
    .notNull(),
});

export const nouns = sqliteTable(
  "nouns",
  {
    lexicon_id: text("lexicon_id")
      .references(() => lexicon.id)
      .notNull(),
    lang: text("lang")
      .references(() => languages.lang)
      .notNull(),
    gender: text("gender").notNull(),
    article: text("article").notNull(),
    singular: text("singular").notNull(),
    plural: text("plural").notNull(),
    example: text("example").notNull(),
  },
  (self) => ({
    pk: primaryKey({ columns: [self.lexicon_id, self.lang] }),
    lang_index: index("nouns_lang_index").on(self.lang),
  }),
);

type Tense = {
  first_singular: string;
  second_singular: string;
  third_singular: string;
  first_plural: string;
  second_plural: string;
  third_plural: string;
};

type PresentPerfect = {
  auxiliary_verb: string;
  past_participle: string;
};

type Imperative = {
  form: string;
  formality?: "formal" | "informal";
  cardinality?: "singular" | "plural";
};

export const verbs = sqliteTable(
  "verbs",
  {
    lexicon_id: text("lexicon_id")
      .references(() => lexicon.id)
      .notNull(),
    lang: text("lang")
      .references(() => languages.lang)
      .notNull(),
    infinitive: text("infinitive").notNull(),
    present: blob("present", { mode: "json" }).$type<Tense>().notNull(),
    past: blob("past", { mode: "json" }).$type<Tense>().notNull(),
    present_perfect: blob("present_perfect", { mode: "json" })
      .$type<PresentPerfect>()
      .notNull(),
    imperative: blob("imperative", { mode: "json" })
      .$type<Array<Imperative>>()
      .notNull(),
  },
  (self) => ({
    pk: primaryKey({ columns: [self.lexicon_id, self.lang] }),
    lang_index: index("verbs_lang_index").on(self.lang),
  }),
);

export const decks = sqliteTable("decks", {
  id: id("id"),
  name: text("name").notNull(),
  user_id: text("user_id")
    .references(() => users.id)
    .notNull(),
  lang: text("lang")
    .references(() => languages.lang)
    .notNull(),
});

export const cards = sqliteTable(
  "cards",
  {
    deck_id: text("deck_id")
      .references(() => decks.id)
      .notNull(),
    lexicon_id: text("lexicon_id")
      .references(() => lexicon.id)
      .notNull(),
  },
  (self) => ({
    pk: primaryKey({ columns: [self.deck_id, self.lexicon_id] }),
    lexicon_index: index("lexicon_index").on(self.lexicon_id),
  }),
);

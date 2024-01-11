import { InferSelectModel } from "drizzle-orm";
import {
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";
import nanoid from "~/lib/nanoid";
import { Conjugation } from "~/lib/types";

export const users = pgTable("users", {
  id: text("id")
    .$default(() => nanoid())
    .primaryKey(),
  email: text("email").unique().notNull(),
  salt: text("salt").notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

export const TYPES = ["noun", "verb", "other"] as const;
export type Type = (typeof TYPES)[number];

export const typeEnum = pgEnum("type", TYPES);

export const lexicon = pgTable("lexicon", {
  id: text("id")
    .$default(() => nanoid())
    .primaryKey(),
  type: typeEnum("type").notNull(),
});

export type Lexicon = InferSelectModel<typeof lexicon>;

export const cards = pgTable(
  "cards",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
    lexiconId: text("lexiconId")
      .notNull()
      .references(() => lexicon.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    repetition: integer("repetition").notNull(),
    easinessFactor: integer("easinessFactor").notNull(),
    interval: integer("interval").notNull(),
    updatedAt: date("updatedAt", { mode: "date" }).notNull(),
  },
  (self) => ({
    pk: primaryKey({ columns: [self.userId, self.lexiconId] }),
  })
);

export const nouns = pgTable("nouns", {
  id: text("id")
    .$default(() => nanoid())
    .primaryKey(),
  singular: text("singular").unique().notNull(),
  plural: text("plural").notNull(),
  french: text("french").notNull(),
});

export type Noun = InferSelectModel<typeof nouns>;

export const verbs = pgTable("verbs", {
  id: text("id")
    .$default(() => nanoid())
    .primaryKey(),
  infinitive: text("infinitive").unique().notNull(),
  present: jsonb("present").$type<Conjugation>().notNull(),
  french: text("french").notNull(),
});

export type Verb = InferSelectModel<typeof verbs>;

export const others = pgTable("others", {
  id: text("id")
    .$default(() => nanoid())
    .primaryKey(),
  expression: text("expression").unique().notNull(),
  french: text("french").notNull(),
});

export type Other = InferSelectModel<typeof others>;

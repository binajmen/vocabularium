import { InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import nanoid from "~/lib/nanoid";
import { Conjugation } from "~/lib/types";

export const users = pgTable("users", {
  id: text("id")
    .$default(() => nanoid())
    .primaryKey(),
  email: text("email").unique().notNull(),
  key: text("key"),
});

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

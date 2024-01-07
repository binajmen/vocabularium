import { jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import nanoid from "~/lib/nanoid";
import { Conjugation } from "~/lib/types";

export const nouns = pgTable("nouns", {
  id: varchar("id", { length: 13 })
    .$default(() => nanoid())
    .primaryKey(),
  singular: varchar("singular", { length: 128 }).notNull(),
  plural: varchar("plural", { length: 128 }).notNull(),
  french: varchar("french", { length: 128 }).notNull(),
});

export const verbs = pgTable("verbs", {
  id: varchar("id", { length: 13 })
    .$default(() => nanoid())
    .primaryKey(),
  infinitive: varchar("infinitive", { length: 128 }).notNull(),
  present: jsonb("present").$type<Conjugation>().notNull(),
  french: varchar("french", { length: 128 }).notNull(),
});

export const others = pgTable("others", {
  id: varchar("id", { length: 13 })
    .$default(() => nanoid())
    .primaryKey(),
  expression: varchar("expression", { length: 128 }).notNull(),
  french: varchar("french", { length: 128 }).notNull(),
});

CREATE TABLE IF NOT EXISTS "nouns" (
	"id" text PRIMARY KEY NOT NULL,
	"singular" text NOT NULL,
	"plural" text NOT NULL,
	"french" text NOT NULL,
	CONSTRAINT "nouns_singular_unique" UNIQUE("singular")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "others" (
	"id" text PRIMARY KEY NOT NULL,
	"expression" text NOT NULL,
	"french" text NOT NULL,
	CONSTRAINT "others_expression_unique" UNIQUE("expression")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"key" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verbs" (
	"id" text PRIMARY KEY NOT NULL,
	"infinitive" text NOT NULL,
	"present" jsonb NOT NULL,
	"french" text NOT NULL,
	CONSTRAINT "verbs_infinitive_unique" UNIQUE("infinitive")
);

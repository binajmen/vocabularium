CREATE TABLE IF NOT EXISTS "nouns" (
	"id" varchar(13) PRIMARY KEY NOT NULL,
	"singular" varchar(128) NOT NULL,
	"plural" varchar(128) NOT NULL,
	"french" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "others" (
	"id" varchar(13) PRIMARY KEY NOT NULL,
	"expression" varchar(128) NOT NULL,
	"french" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verbs" (
	"id" varchar(13) PRIMARY KEY NOT NULL,
	"infinitive" varchar(128) NOT NULL,
	"present" jsonb NOT NULL,
	"french" varchar(128) NOT NULL
);

DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('noun', 'verb', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cards" (
	"userId" text NOT NULL,
	"lexiconId" text NOT NULL,
	"repetition" integer NOT NULL,
	"easinessFactor" integer NOT NULL,
	"interval" integer NOT NULL,
	"updatedAt" date NOT NULL,
	CONSTRAINT "cards_userId_lexiconId_pk" PRIMARY KEY("userId","lexiconId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lexicon" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "type" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "salt" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "key";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cards" ADD CONSTRAINT "cards_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cards" ADD CONSTRAINT "cards_lexiconId_lexicon_id_fk" FOREIGN KEY ("lexiconId") REFERENCES "public"."lexicon"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

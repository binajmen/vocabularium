ALTER TABLE "nouns" ADD CONSTRAINT "nouns_singular_unique" UNIQUE("singular");--> statement-breakpoint
ALTER TABLE "others" ADD CONSTRAINT "others_expression_unique" UNIQUE("expression");--> statement-breakpoint
ALTER TABLE "verbs" ADD CONSTRAINT "verbs_infinitive_unique" UNIQUE("infinitive");
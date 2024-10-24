dev:
	PORT=4269 bun dev

drizzle-push:
	bun drizzle-kit push

reset:
	rm db.sqlite
	bun drizzle-kit push
	bun run src/database/seed.ts

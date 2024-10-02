export default {
  dialect: "sqlite",
  schema: "./src/database/schema.ts",
  out: "./migrations/",
  // driver: "better-sqlite",
  dbCredentials: {
    url: './db.sqlite',
  },
};

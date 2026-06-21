import { Pool } from "pg";

let pool;

export function connectDB() {
  if (!pool) {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

    if (!DB_USER) {
      throw new Error("DB_USER not defined. Check .env.local");
    }

    pool = new Pool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: parseInt(DB_PORT || "5432", 10),
      ssl: false,
    });
  }

  return pool;
}

import dotenv from "dotenv";
dotenv.config(); // force load .env.local
import mysql from "mysql2/promise";

export async function connectDB() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

  if (!DB_USER) {
    throw new Error("DB_USER not defined. Check .env.local");
  }

  return mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT || 3306,
  });
}

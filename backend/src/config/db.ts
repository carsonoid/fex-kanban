import { Pool } from "pg";

// Create a new pool instance
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 54645, // Default PostgreSQL port
});

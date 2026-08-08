import pkg from "pg";
import dotenv from "dotenv";

dotenv.config({ override: true });

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : { rejectUnauthorized: false },
});

pool.on("connect", () => {
  console.log("Database Connected Successfully");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export const query = (text, params) => pool.query(text, params);
export { pool };
export default pool;

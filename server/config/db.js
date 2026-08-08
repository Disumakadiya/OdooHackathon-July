import pkg from "pg";
import dotenv from "dotenv";

dotenv.config({ override: true });

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;

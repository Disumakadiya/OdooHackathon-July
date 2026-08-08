import pool from "./config/db.js";

const r = await pool.query(
  "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'assets' ORDER BY ordinal_position"
);
console.log("Assets columns:");
r.rows.forEach(c => console.log(`  ${c.column_name} (${c.data_type}) nullable=${c.is_nullable} default=${c.column_default}`));

await pool.end();

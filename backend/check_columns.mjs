import pool from "./config/db.js";

const tables = ["assets", "asset_allocations", "asset_transfers", "asset_returns"];

for (const table of tables) {
  const result = await pool.query(
    "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position",
    [table]
  );
  console.log(`\n=== ${table} ===`);
  console.log(result.rows.map(r => `  ${r.column_name} (${r.data_type})`).join("\n"));
}

await pool.end();

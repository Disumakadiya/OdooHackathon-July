export default function AssetTable({ columns, rows, emptyMessage }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b border-outline-variant">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 text-left font-label-lg text-label-lg text-on-surface-variant">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id} className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low">
                {columns.map((column) => (
                  <td key={`${row.id}-${column.key}`} className="px-4 py-3 font-body-md text-body-md text-on-surface">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-4 text-center font-body-md text-body-md text-on-surface-variant">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
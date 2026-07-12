export default function Table({ columns = [], rows = [] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-outline-variant">
      <table className="w-full border-collapse bg-surface">
        <thead className="bg-surface-container-low">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-md py-sm text-left font-label-md text-label-md text-on-surface-variant">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? index} className="border-t border-outline-variant">
              {columns.map((column) => (
                <td key={column.key} className="px-md py-sm font-body-md text-body-md text-on-surface">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

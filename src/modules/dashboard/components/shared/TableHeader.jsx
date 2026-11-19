// Table head row for dashboard tables. columns: [{ label, className? }]
export const TableHeader = ({ columns }) => (
  <thead>
    <tr className="border-b border-[#f1ebe3] bg-[#fbf8f4] font-mono text-[10px] uppercase tracking-wider text-[#8a7b6f]">
      {columns.map((col) => (
        <th key={col.label} className={`px-5 py-3 font-semibold ${col.className || ''}`}>
          {col.label}
        </th>
      ))}
    </tr>
  </thead>
);

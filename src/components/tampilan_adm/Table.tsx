import React from "react";

type Column<T> = {
  header: string;
  accessor: keyof T & string;
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
};

const Table = <T,>({ columns, renderRow, data }: TableProps<T>) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <React.Fragment key={idx}>{renderRow(item)}</React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
